import { MedusaService } from "@medusajs/framework/utils"
import { ContentItem } from "./models/content-item"

export default class ContentModuleService extends MedusaService({
  ContentItem,
}) {}
