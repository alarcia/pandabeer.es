# syntax=docker/dockerfile:1.7
#
# Medusa backend image — built from the monorepo root as context.
#   docker build -f apps/backend/Dockerfile -t pandabeer-backend .
#
# Medusa v2 build model (per docs): `medusa build` emits a self-contained app into
# .medusa/server with its OWN package.json. Production then runs *inside* that dir:
# install deps there, run migrations (predeploy), then `medusa start`.

# ── deps: install the workspace so `medusa build` can run ──────────────────────
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/backend/package.json apps/backend/package.json
RUN pnpm install --frozen-lockfile

# ── build: produce .medusa/server and install its production deps ──────────────
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .

# `medusa build` reads config/admin at build time; it does not need the DB.
RUN pnpm --dir apps/backend build

# The emitted server is a standalone npm project. Install its prod dependencies
# in place so the runtime stage can just copy the finished directory.
WORKDIR /app/apps/backend/.medusa/server
RUN npm install --omit=dev

# ── runtime: ship only the built server ───────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/backend/.medusa/server ./
COPY --chmod=0755 apps/backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Medusa listens on 9000.
EXPOSE 9000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -q -O /dev/null http://localhost:9000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
