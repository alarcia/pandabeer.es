import Medusa from "@medusajs/js-sdk"

/**
 * Instancia única del SDK de Medusa para el storefront.
 *
 * Se usa desde React Server Components (fetch en el servidor, bueno para SEO).
 * El SDK añade automáticamente la publishable API key en las peticiones a la
 * Store API; NUNCA usar fetch() a pelo (faltarían cabeceras y daría error).
 *
 * Variables de entorno (ver .env.example):
 *  - NEXT_PUBLIC_MEDUSA_BACKEND_URL   → URL del backend Medusa
 *  - NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY → clave pk_... del sales channel
 */
export const sdk = new Medusa({
  baseUrl:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
