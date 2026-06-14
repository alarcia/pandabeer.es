import { sdk } from "@/lib/medusa"

/** Maximum number of beers in the "Currently Pouring" grid.
 *  6 fits the 4-column grid (4+2) with no orphan rows; the most
 *  recent/featured ones go here, the rest of the catalogue lives in the shop. */
const POURING_MAX = 6

/** Product fields we request from the Store API (hero and grid share the shape). */
const PRODUCT_FIELDS =
  "id,title,subtitle,description,created_at,metadata,*images,*variants.calculated_price"

/**
 * Minimal view shape of a beer. What the components need to
 * render, decoupled from the full Medusa product shape.
 */
export type Beer = {
  title: string
  /** Style + ABV (native `subtitle` field), e.g. "IPA · 6.5%". */
  style: string | null
  /** Marketing badge (`metadata.tag`), e.g. "Limited edition". */
  tag: string | null
  body: string | null
  imageUrl: string | null
  price: string | null
}

/**
 * Hero featured beer, or null if there's no backend, no key, or no
 * product is marked.
 *
 * Curation: marked in the admin with `metadata.hero_featured = true`. The Store
 * API can't reliably filter by arbitrary metadata, so we fetch a small
 * batch and pick in JS. If the catalogue grows large, migrate to a
 * collection or a `site_content` module (see plan).
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
 * Beers for the "Currently Pouring" grid: those marked in the admin with
 * `metadata.pouring = true`, capped at POURING_MAX.
 *
 * Order (see comparePouring):
 *   1) first those with `metadata.pouring_order` (ascending number),
 *   2) then the rest by creation date descending (newest on top).
 * This way, creating a new beer places it on top without renumbering anything;
 * `pouring_order` stays as an optional override to "pin" specific beers.
 *
 * Returns [] if there's no backend / key / none marked — the component then
 * falls back to the home.json placeholder.
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

/** Minimal product type we consume (what we request in PRODUCT_FIELDS). */
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
 * Fetches a batch of products from the Store API with the region context needed
 * for prices. Returns null on any failure or if the key is missing, so that
 * callers degrade to the placeholder (the site never renders blank).
 */
async function listProducts(): Promise<StoreProductLike[] | null> {
  // With no key configured there's no point in calling.
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    return null
  }

  try {
    // Medusa v2 requires a region_id as the context to calculate prices.
    const regionId = await getDefaultRegionId()

    const { products } = await sdk.store.product.list({
      limit: 50,
      fields: PRODUCT_FIELDS,
      ...(regionId ? { region_id: regionId } : {}),
    })

    return products as StoreProductLike[]
  } catch {
    // Backend down, CORS, invalid key... degrade to placeholder.
    return null
  }
}

/** First available region, used as the price context. null if there's none. */
async function getDefaultRegionId(): Promise<string | null> {
  try {
    const { regions } = await sdk.store.region.list({ limit: 1 })
    return regions[0]?.id ?? null
  } catch {
    return null
  }
}

/** Maps a Medusa product to the minimal view shape. */
function toBeer(product: StoreProductLike): Beer {
  const tag = product.metadata?.tag
  return {
    title: product.title,
    style: product.subtitle ?? null,
    tag: typeof tag === "string" && tag.trim() !== "" ? tag : null,
    body: product.description ?? null,
    // Original image (not the thumbnail): Medusa crops the thumbnail and may
    // lose transparency/ratio. The original is the cropped vertical PNG
    // of the bottle, shown whole over the brand gradient.
    imageUrl: product.images?.[0]?.url ?? product.thumbnail ?? null,
    price: formatPrice(product),
  }
}

/**
 * Formats the first variant's price in EUR. `calculated_amount` comes
 * in major units (4.5 = 4,50 €): use it AS IS, NEVER divide by 100.
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

/** A metadata flag is truthy whether it's the boolean true or the string "true". */
function hasFlag(value: unknown): boolean {
  return value === true || value === "true"
}

/**
 * Grid comparator: beers with `pouring_order` go first (ascending
 * number); those without it come after, by `created_at` descending.
 */
function comparePouring(a: StoreProductLike, b: StoreProductLike): number {
  const orderA = pouringOrder(a.metadata)
  const orderB = pouringOrder(b.metadata)

  // Both with explicit order (or both without): break the tie by the order itself.
  if (orderA !== orderB) {
    return orderA - orderB
  }

  // No explicit order on either: newest first.
  return createdAtMs(b) - createdAtMs(a)
}

/** Reads `pouring_order` as a number; beers without an order go last (Infinity). */
function pouringOrder(metadata: Record<string, unknown> | null | undefined): number {
  const raw = metadata?.pouring_order
  const n = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

/** `created_at` in milliseconds; 0 if missing or not parseable. */
function createdAtMs(product: StoreProductLike): number {
  const t = product.created_at ? Date.parse(product.created_at) : NaN
  return Number.isFinite(t) ? t : 0
}
