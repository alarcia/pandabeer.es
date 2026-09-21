import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../../modules/content"
import ContentModuleService from "../../../../modules/content/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { key } = req.params
  const contentService: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const items = await contentService.listContentItems({ key })

  if (!items.length) {
    res.status(404).json({ message: `Content item '${key}' not found` })
    return
  }

  res.json({ item: items[0] })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { key } = req.params
  const body = req.body as {
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

  const contentService: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const existing = await contentService.listContentItems({ key })

  let item
  if (existing.length > 0) {
    item = await contentService.updateContentItems({
      id: existing[0].id,
      ...body,
    })
  } else {
    item = await contentService.createContentItems({
      key,
      ...body,
    })
  }

  res.json({ item })
}
