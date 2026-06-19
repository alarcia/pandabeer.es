# syntax=docker/dockerfile:1.7
#
# Storefront (Next.js) image — built from the monorepo root as context.
#   docker build -f apps/web/Dockerfile -t pandabeer-web .
# Relies on Next's `output: "standalone"` (see apps/web/next.config.ts) to ship a
# minimal runtime: server.js + only the node_modules actually traced as used.

# ── deps: install the full workspace once, cached on lockfile + manifests ──────
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app

# Copy only what affects dependency resolution first, to maximize layer caching.
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/backend/package.json apps/backend/package.json
# Cache mount keeps downloaded packages between builds — the network is the bottleneck on the Pi.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir=/pnpm-store

# ── build: compile the Next.js app into a standalone bundle ───────────────────
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so the
# publishable key and backend URL must be present here, not just at runtime.
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm --dir apps/web build

# ── runtime: copy just the standalone output ──────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# The standalone bundle nests the workspace path: server.js lives under apps/web.
# `static` and `public` are not traced into standalone and must be copied alongside.
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public

# Run unprivileged (the node:alpine image ships a `node` user).
USER node

EXPOSE 3000
# Use 127.0.0.1 (not "localhost"): BusyBox wget may resolve localhost to ::1 while
# Next listens on IPv4 0.0.0.0, which made the check fail despite the app serving fine.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", "apps/web/server.js"]
