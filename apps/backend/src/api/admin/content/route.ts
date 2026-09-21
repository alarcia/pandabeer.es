import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../modules/content"
import ContentModuleService from "../../../modules/content/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const contentService: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const items = await contentService.listContentItems({}, { take: 100 })
  res.json({ content: items })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as {
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

  if (!body.key) {
    res.status(400).json({ message: "Field 'key' is required" })
    return
  }

  const contentService: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const existing = await contentService.listContentItems({ key: body.key })

  let item
  if (existing.length > 0) {
    item = await contentService.updateContentItems({
      id: existing[0].id,
      ...body,
    })
  } else {
    item = await contentService.createContentItems(body)
  }

  res.json({ item })
}
