import { sdk } from "@/lib/medusa"

/** Máximo de cervezas en el grid "Currently Pouring".
 *  6 encaja con el grid de 4 columnas (4+2) sin filas huérfanas; las más
 *  recientes/destacadas van aquí, el resto del catálogo se ve en la tienda. */
const POURING_MAX = 6

/** Campos de producto que pedimos a la Store API (hero y grid comparten shape). */
const PRODUCT_FIELDS =
  "id,title,subtitle,description,created_at,metadata,*images,*variants.calculated_price"

/**
 * Forma de vista mínima de una cerveza. Lo que los componentes necesitan
 * pintar, desacoplado del shape completo del producto de Medusa.
 */
export type Beer = {
  title: string
  /** Estilo + ABV (campo nativo `subtitle`), ej. "IPA · 6,5%". */
  style: string | null
  /** Badge de marketing (`metadata.tag`), ej. "Edición limitada". */
  tag: string | null
  body: string | null
  imageUrl: string | null
  price: string | null
}

/**
 * Cerveza destacada del hero, o null si no hay backend, no hay key, o ningún
 * producto está marcado.
 *
 * Curación: se marca en el admin con `metadata.hero_featured = true`. La Store
 * API no filtra de forma fiable por metadata arbitraria, así que pedimos un
 * lote pequeño y elegimos en JS. Si el catálogo crece mucho, migrar a una
 * colección o a un módulo `site_content` (ver plan).
 */
export async function getHeroFeatured(): Promise<Beer | null> {
  const products = await listProducts()
  if (!products) {
    return null
  }

  const featured = products.find((p) => hasFlag(p.metadata?.hero_featured))
  return featured ? toBeer(featured) : null
}

/**
 * Cervezas del grid "Currently Pouring": las marcadas en el admin con
 * `metadata.pouring = true`, con un tope de POURING_MAX.
 *
 * Orden (ver comparePouring):
 *   1) primero las que tienen `metadata.pouring_order` (número ascendente),
 *   2) después el resto por fecha de creación descendente (lo nuevo arriba).
 * Así, crear una cerveza nueva la coloca arriba sin renumerar nada; el
 * `pouring_order` queda como override opcional para "fijar" cervezas concretas.
 *
 * Devuelve [] si no hay backend / key / ninguna marcada — el componente cae
 * entonces al placeholder de home.json.
 */
export async function getCurrentlyPouring(): Promise<Beer[]> {
  const products = await listProducts()
  if (!products) {
    return []
  }

  return products
    .filter((p) => hasFlag(p.metadata?.pouring))
    .sort(comparePouring)
    .slice(0, POURING_MAX)
    .map(toBeer)
}

/** Tipo mínimo de producto que consumimos (lo que pedimos en PRODUCT_FIELDS). */
type StoreProductLike = {
  title: string
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  created_at?: string | null
  metadata?: Record<string, unknown> | null
  images?: { url: string }[] | null
  variants?:
    | { calculated_price?: { calculated_amount?: number | null; currency_code?: string | null } | null }[]
    | null
}

/**
 * Pide un lote de productos a la Store API con el contexto de región necesario
 * para los precios. Devuelve null ante cualquier fallo o si falta la key, para
 * que los llamadores degraden al placeholder (la web nunca se rompe en blanco).
 */
async function listProducts(): Promise<StoreProductLike[] | null> {
  // Sin key configurada no tiene sentido llamar.
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return null
  }

  try {
    // Medusa v2 exige un region_id como contexto para calcular precios.
    const regionId = await getDefaultRegionId()

    const { products } = await sdk.store.product.list({
      limit: 50,
      fields: PRODUCT_FIELDS,
      ...(regionId ? { region_id: regionId } : {}),
    })

    return products as StoreProductLike[]
  } catch {
    // Backend caído, CORS, key inválida... degradamos a placeholder.
    return null
  }
}

/** Primera región disponible, usada como contexto de precio. null si no hay. */
async function getDefaultRegionId(): Promise<string | null> {
  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    return regions[0]?.id ?? null
  } catch {
    return null
  }
}

/** Mapea un producto de Medusa a la forma de vista mínima. */
function toBeer(product: StoreProductLike): Beer {
  const tag = product.metadata?.tag
  return {
    title: product.title,
    style: product.subtitle ?? null,
    tag: typeof tag === "string" && tag.trim() !== "" ? tag : null,
    body: product.description ?? null,
    // Imagen original (no el thumbnail): Medusa recorta el thumbnail y puede
    // perder la transparencia/ratio. La original es el PNG vertical recortado
    // de la botella, que se muestra entero sobre el degradado de marca.
    imageUrl: product.images?.[0]?.url ?? product.thumbnail ?? null,
    price: formatPrice(product),
  }
}

/**
 * Formatea el precio de la primera variante en EUR. `calculated_amount` viene
 * en la unidad mayor (4.5 = 4,50 €): se usa TAL CUAL, NUNCA dividir entre 100.
 */
function formatPrice(product: StoreProductLike): string | null {
  const price = product.variants?.[0]?.calculated_price
  const amount = price?.calculated_amount

  if (amount == null) {
    return null
  }

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: (price?.currency_code ?? "eur").toUpperCase(),
  }).format(amount)
}

/** Un flag de metadata es verdadero tanto si es booleano true como string "true". */
function hasFlag(value: unknown): boolean {
  return value === true || value === "true"
}

/**
 * Comparador del grid: las cervezas con `pouring_order` van primero (número
 * ascendente); las que no lo tienen, después, por `created_at` descendente.
 */
function comparePouring(a: StoreProductLike, b: StoreProductLike): number {
  const orderA = pouringOrder(a.metadata)
  const orderB = pouringOrder(b.metadata)

  // Ambas con orden explícito (o ambas sin él): desempata por el propio orden.
  if (orderA !== orderB) {
    return orderA - orderB
  }

  // Sin orden explícito en ambas: más reciente primero.
  return createdAtMs(b) - createdAtMs(a)
}

/** Lee `pouring_order` como número; las cervezas sin orden van al final (Infinity). */
function pouringOrder(metadata: Record<string, unknown> | null | undefined): number {
  const raw = metadata?.pouring_order
  const n = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

/** `created_at` en milisegundos; 0 si falta o no es parseable. */
function createdAtMs(product: StoreProductLike): number {
  const t = product.created_at ? Date.parse(product.created_at) : NaN
  return Number.isFinite(t) ? t : 0
}
