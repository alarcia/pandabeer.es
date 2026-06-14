import Medusa from "@medusajs/js-sdk"

/**
 * Single Medusa SDK instance for the storefront.
 *
 * Used from React Server Components (server-side fetch, good for SEO).
 * The SDK automatically adds the publishable API key on requests to the
 * Store API; NEVER use raw fetch() (headers would be missing and it would error).
 *
 * Environment variables (see .env.example):
 *  - NEXT_PUBLIC_MEDUSA_BACKEND_URL   → Medusa backend URL
 *  - NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY → pk_... key of the sales channel
 */
export const sdk = new Medusa({
  baseUrl:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
