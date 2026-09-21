import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../../modules/content"
import ContentModuleService from "../../../../modules/content/service"

export const AUTHENTICATE = false

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { key } = req.params
  const contentService: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const items = await contentService.listContentItems({ key, is_active: true })

  if (!items.length) {
    res.status(404).json({ message: `Content item with key '${key}' not found` })
    return
  }

  res.json({ item: items[0] })
}
