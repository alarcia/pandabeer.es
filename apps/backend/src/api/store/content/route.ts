import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTENT_MODULE } from "../../../modules/content"
import ContentModuleService from "../../../modules/content/service"

export const AUTHENTICATE = false

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const contentService: ContentModuleService = req.scope.resolve(CONTENT_MODULE)
  const items = await contentService.listContentItems(
    { is_active: true },
    { take: 50 }
  )
  res.json({ content: items })
}
