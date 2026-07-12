import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // DATABASE_SSL_DISABLED=true in the local .env (Pi without SSL).
    // In production (Neon) it's left undefined and SSL stays on by default.
    ...(process.env.DATABASE_SSL_DISABLED === "true" && {
      databaseDriverOptions: { connection: { ssl: false } },
    }),
    redisUrl: process.env.REDIS_URL,
    workerMode: (process.env.WORKER_MODE as "shared" | "worker" | "server") || "shared",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.ADMIN_DISABLED === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    storefrontUrl: process.env.MEDUSA_STOREFRONT_URL || "http://localhost:3000",
  },
  modules: [
    {
      // File storage for uploaded product images. We configure the default local
      // (on-disk) provider explicitly:
      //  - backend_url is the base URL Medusa stores for each file. It must be an
      //    ABSOLUTE URL at the backend's PUBLIC host: the storefront renders these
      //    images from a different origin than the backend, so a relative
      //    "/static/..." would resolve against the storefront and 404. Driven by
      //    MEDUSA_BACKEND_URL so each environment supplies its own host — no hardcode.
      //  - upload_dir is where files are written on disk. In the Pi container this is
      //    an absolute path bind-mounted to a host folder (see docker-compose.app.yml),
      //    so uploads survive image rebuilds; locally it defaults to "static"
      //    (apps/backend/static), the previous behaviour.
      // When the backend eventually runs on an ephemeral host (no persistent disk),
      // swap this provider for the S3-compatible one (@medusajs/file-s3, e.g.
      // Cloudflare R2) — same File Module, just a different provider block.
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              backend_url: `${process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}/static`,
              upload_dir: process.env.FILE_UPLOAD_DIR || "static",
            },
          },
        ],
      },
    },
  ],
});
