import { model } from "@medusajs/framework/utils"

export const ContentItem = model.define("content_item", {
  id: model.id().primaryKey(),
  key: model.text().unique(),
  section: model.text().default("general"),
  title: model.text().nullable(),
  subtitle: model.text().nullable(),
  body: model.text().nullable(),
  image_url: model.text().nullable(),
  link_url: model.text().nullable(),
  link_text: model.text().nullable(),
  is_active: model.boolean().default(true),
  metadata: model.json().nullable(),
})
