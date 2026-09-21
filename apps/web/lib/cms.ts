import { cache } from "react"

export type ContentItem = {
  id?: string
  key: string
  section?: string
  title?: string | null
  subtitle?: string | null
  body?: string | null
  image_url?: string | null
  link_url?: string | null
  link_text?: string | null
  is_active?: boolean
  metadata?: Record<string, unknown> | null
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * Fetches all active CMS content items from Medusa Store API.
 * Uses Next.js ISR revalidation (every 60s) with per-request memoization.
 * Fails gracefully to empty records if Medusa backend is unreachable.
 */
export const getAllContent = cache(async function getAllContent(): Promise<
  Record<string, ContentItem>
> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/content`, {
      next: { revalidate: 60, tags: ["content"] },
    })

    if (!res.ok) {
      return {}
    }

    const data = (await res.json()) as { content?: ContentItem[] }
    if (!data.content || !Array.isArray(data.content)) {
      return {}
    }

    const map: Record<string, ContentItem> = {}
    for (const item of data.content) {
      if (item.key) {
        map[item.key] = item
      }
    }
    return map
  } catch {
    // Backend offline / network issue: fallback to static templates
    return {}
  }
})

/**
 * Helper to get a specific content item by its key.
 */
export async function getContent(key: string): Promise<ContentItem | null> {
  const all = await getAllContent()
  return all[key] ?? null
}
