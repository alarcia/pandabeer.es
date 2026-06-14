# AGENTS.md

## Project summary

- Public website for a craft beer company: beers showcase, brand content, news, events, fairs, and ecommerce.
- Two halves: a brand-showcase landing, and a store (search, user accounts, cart, payments) reached
  from the "Shop" button. Currently only the showcase is built and "Shop" links to an external URL.
  The store is planned under the same domain at `pandabeer.es/shop` (one brand, one URL) as the
  **last phase**; the integration approach is undecided (possibly the Medusa ecommerce template).
- Next.js storefront backed by a Medusa.js backoffice where content and store data are managed.

## Repository structure

- Monorepo with pnpm workspaces.
- `apps/web` — Next.js storefront (`@pandabeer/web`).
- `apps/backend` — Medusa.js backend (`@pandabeer/medusa-backend`).

## Agent Conventions

- The agent MAY edit any file in the repo and run commands at will (dev servers, builds,
  migrations, etc.) to inspect things and make progress. There is no test suite yet — do not
  invent test commands.
- The agent must NEVER create git commits (or push). Leave changes in the working tree for the
  developer to review and commit manually.

## Stack

- Language: TypeScript (strict mode)
- Frontend framework: Next.js 16 (React 19)
- Runtime: Node.js
- Package manager: pnpm workspaces (monorepo)
- Component system: Tailwind CSS v4

## Backend

- Headless platform: Medusa.js v2.
- Auth, store data and admin are provided by Medusa (`@medusajs/framework`, `@medusajs/medusa`, `@medusajs/admin-sdk`).
- The storefront talks to Medusa via `@medusajs/js-sdk`, from the **server** (Server Components / route handlers),
  not directly from the browser. See `apps/web/lib/`.
- Configure the storefront with `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
  (see `apps/web/.env.example`). The publishable key is created in the Medusa admin
  (Settings → Publishable API Keys).

## Database

- Engine: PostgreSQL (ORM: MikroORM, via Medusa — no separate access layer).
- Redis for Medusa workers/events.
- Local & dev: Docker containers on the Raspberry Pi (`docker-compose.yml`, named volume).
- Production: Neon (PostgreSQL) + Upstash (Redis).
- Set `DATABASE_SSL_DISABLED=true` only when Postgres has no SSL (e.g. the local Pi);
  leave unset in production (Neon). See `apps/backend/.env.example`.

## Domain

- Production: `pandabeer.es`
- Staging: `dev.pandabeer.es`
- Registrar: IONOS (the `.es` domain stays there — Cloudflare Registrar doesn't accept `.es`)
- DNS: Cloudflare (nameservers delegated to Cloudflare; DNS managed from the Cloudflare panel, not IONOS)
- Email: still on IONOS (MX `mx*.ionos.es`); migrating it off IONOS is pending future work, do not touch DNS mail records (MX/SPF/DKIM/DMARC) without care.
- HTTPS — production: automatic via managed platform; staging: Caddy (Let's Encrypt) on the self-managed machine.

## Deployment

- Local: framework dev servers; infra (Postgres/Redis) on the Raspberry Pi.
- Staging: self-managed machine, Docker (`docker-compose.yml`), self-hosted GitHub Actions runner.
- Production: managed platform; GitHub Actions handles CI, the platform handles the deploy.
- Secrets: keep `.env.example` in the repo; never commit real secrets. Inject runtime secrets from
  CI or the platform env dashboard — no `.env` files on production servers.

## Design

- DESIGN.md: `[repo root]/design.md`
- Component system: Tailwind CSS v4 (CSS-first `@theme`, no component library)
- Mode: both · Viewport priority: desktop-first
- Primary references: craft beer labels, vintage bar posters, premium packaging
