# syntax=docker/dockerfile:1.7
#
# Medusa backend image — built from the monorepo root as context.
#   docker build -f apps/backend/Dockerfile -t pandabeer-backend .
#
# Medusa v2 build model: `medusa build` emits a runnable app into .medusa/server
# with its own package.json (whose prod deps are IDENTICAL to apps/backend's).
# Instead of running a second `npm install` in there (which re-downloaded ~1000
# packages and took ~1h45m on the Pi), we keep .medusa/server INSIDE the workspace
# tree that pnpm already installed, so Node resolves its deps by walking up to the
# hoisted node_modules. No second install.

# ── deps: install the workspace so `medusa build` can run ──────────────────────
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/backend/package.json apps/backend/package.json
# Cache mount keeps downloaded packages between builds.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store \
    pnpm install --frozen-lockfile --store-dir=/pnpm-store

# ── build: produce .medusa/server (no second install) ─────────────────────────
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .

# admin.backendUrl is baked into the admin bundle at build time (medusa build), so the
# public backend URL must be present HERE, not just at runtime. Without it the admin
# defaults to http://localhost:9000 and login from the browser never reaches the server.
ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

# `medusa build` reads config/admin at build time; it does not need the DB.
RUN pnpm --dir apps/backend build

# ── runtime: ship the workspace tree (deps) + the built server ────────────────
# Node resolves modules by walking up directories, so .medusa/server finds its
# deps in the hoisted /app/node_modules. pnpm uses symlinks into node_modules/.pnpm,
# so we must copy the FULL tree (root + backend node_modules), not just the leaf dirs.
FROM node:22-alpine AS runtime
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production

# Workspace dependency trees (with the .pnpm store the symlinks point to).
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
# The built server lives at its workspace path so module resolution walks up to node_modules.
COPY --from=build /app/apps/backend/.medusa/server ./apps/backend/.medusa/server
COPY --chmod=0755 apps/backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Run from inside the built server (where package.json scripts live).
WORKDIR /app/apps/backend/.medusa/server

# Medusa listens on 9000.
EXPOSE 9000
# Use 127.0.0.1 (not "localhost") to avoid IPv6/IPv4 resolution flakiness in BusyBox wget.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -q -O /dev/null http://127.0.0.1:9000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
