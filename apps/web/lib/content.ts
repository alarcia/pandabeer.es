import { sdk } from "@/lib/medusa"

/**
 * Forma de vista mínima del hero. Lo que el componente necesita pintar,
 * desacoplado del shape completo del producto de Medusa.
 */
export type HeroFeatured = {
  title: string
  style: string | null
  body: string | null
  imageUrl: string | null
  price: string | null
}

/**
 * Devuelve la "cerveza destacada" del hero, o null si no hay backend,
 * no hay key, o ningún producto está marcado como destacado.
 *
 * Curación: el producto destacado se marca en el admin con
 * `metadata.hero_featured = true`. La Store API no filtra de forma fiable
 * por metadata arbitraria, así que pedimos un lote pequeño y elegimos en JS
 * el primero marcado. Suficiente para el skeleton; si el catálogo crece,
 * migrar a una colección o a un módulo `site_content` (ver plan).
 *
 * El precio se muestra TAL CUAL lo da Medusa — NUNCA dividir entre 100.
 */
export async function getHeroFeatured(): Promise<HeroFeatured | null> {
  // Sin key configurada no tiene sentido llamar: caemos al placeholder.
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return null
  }

  try {
    // Medusa v2 exige un region_id como contexto para calcular precios.
    // Resolvemos la primera región disponible; si no hay, seguimos sin precio.
    const regionId = await getDefaultRegionId()

    const { products } = await sdk.store.product.list({
      limit: 50,
      fields: "id,title,subtitle,description,metadata,*images,*variants.calculated_price",
      ...(regionId ? { region_id: regionId } : {}),
    })

    const featured = products.find(
      (p) => p.metadata?.hero_featured === true || p.metadata?.hero_featured === "true",
    )

    if (!featured) {
      return null
    }

    return {
      title: featured.title,
      style: featured.subtitle ?? null,
      body: featured.description ?? null,
      imageUrl: featured.thumbnail ?? featured.images?.[0]?.url ?? null,
      price: formatPrice(featured),
    }
  } catch {
    // Backend caído, CORS, key inválida... la web no se rompe: placeholder.
    return null
  }
}

/**
 * Primera región disponible, usada como contexto de precio.
 * Devuelve null si no hay regiones configuradas (el hero saldrá sin precio).
 */
async function getDefaultRegionId(): Promise<string | null> {
  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    return regions[0]?.id ?? null
  } catch {
    return null
  }
}

/**
 * Toma el precio calculado de la primera variante y lo formatea en EUR.
 * `calculated_amount` viene ya en la unidad mayor (49.99, NO en céntimos):
 * se usa directamente sin dividir.
 */
function formatPrice(product: {
  variants?: { calculated_price?: { calculated_amount?: number | null; currency_code?: string | null } | null }[] | null
}): string | null {
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
