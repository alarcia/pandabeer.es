# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical conventions

- **Never `git commit` or `git push`.** Edit files and run any commands freely (dev servers,
  builds, migrations), but leave changes in the working tree for the developer to commit by hand.
  This is a months-long project worked by multiple agents; the human owns the history.
- **Versioned files are in English.** Code comments, developer-facing prose, and anything
  committed to the repo are written in English. Conversation with the developer is in Spanish.
  **Exception — user-facing site copy is in Spanish.** Text the visitor reads (storefront UI
  strings, `home.json` content, button/label text, etc.) will be written in Spanish; it is not
  yet translated (current copy is placeholder English). Do not translate it preemptively — the
  developer will write the Spanish copy when they get to the texts.
- **Ask in plain prose, not multiple-choice.** Do NOT use the AskUserQuestion tool / fixed-option
  pickers. When you need input, ask the question as normal text and let the developer answer freely —
  they usually have nuance or caveats that don't fit predefined options. Asking is fine and
  encouraged when something is genuinely the developer's call; just do it conversationally.
- `AGENTS.md` (stack/infra/deploy) and `design.md` (visual system + design tokens) are the other
  canonical context docs — read them rather than duplicating their content here.

## Commands

All commands run from the repo root (pnpm workspaces).

```bash
# Frontend — Next.js storefront, http://localhost:3000
pnpm dev            # next dev
pnpm build          # next build
pnpm lint           # eslint (web only — no root/backend lint)

# Backend — Medusa, http://localhost:9000 (admin at /app)
pnpm backend:dev    # medusa develop
pnpm backend:build
pnpm backend:start
pnpm backend:migrate

# Infra — Postgres + Redis (see below)
pnpm infra:up       # docker compose up -d --wait
pnpm infra:down
pnpm infra:logs
```

There is no test suite yet; do not invent test commands.

## Architecture

pnpm-workspace monorepo (`apps/*`) with two independently deployable units:

- **`apps/web`** (`@pandabeer/web`) — Next.js 16 / React 19 / Tailwind v4 storefront, **hand-built
  (not the Medusa starter)**. App Router under `apps/web/app`. Path alias `@/*` → `apps/web/*`.
- **`apps/backend`** (`@pandabeer/medusa-backend`) — Medusa.js v2 backoffice + Store API. Custom
  modules/routes/subscribers go in `apps/backend/src` (currently just an empty entrypoint).

The website has two halves: a **brand showcase** landing, and a **store** reached from the "Shop"
button. **Current state:** only the showcase is built and "Shop" points to an external URL, so
`apps/web` reads catalog/content from Medusa but has no cart/checkout yet. **Roadmap:** the store
lives under the same domain at `pandabeer.es/shop` (search, user accounts, cart, payments) — one
brand, one URL for the visitor. This is the **last phase** of the project and the integration
approach is intentionally undecided (possibly the Medusa ecommerce template, possibly built into
`apps/web` — TBD when we get there). Treat anything cart/checkout/account as future work, not a
deliberate exclusion, and don't assume an architecture for it yet.

### Web → Medusa data flow (the pattern to copy)

This is the established integration pattern; follow it for every new dynamic section.

1. **Always use the SDK, never raw `fetch()`.** Single `@medusajs/js-sdk` instance lives in
   `apps/web/lib/medusa.ts` (export `sdk`); it injects the publishable key automatically.
2. **Fetch in React Server Components** (good for SEO). The data layer is `apps/web/lib/content.ts`,
   which maps Medusa shapes to minimal view types.
3. **Curation via product `metadata`.** E.g. the hero "featured beer" is the product with
   `metadata.hero_featured = true` (set in the admin). The Store API can't reliably filter by
   arbitrary metadata, so `content.ts` fetches a small batch and filters in JS. At larger catalog
   sizes, migrate this to a collection or a custom `site_content` module.
4. **Always degrade gracefully.** If the backend is down / key missing / nothing featured, the data
   function returns `null` and the page falls back to static `apps/web/content/home.json`. The site
   must never render blank.

Medusa v2 gotchas baked into `content.ts`:
- The Store API **requires a `region_id`** as pricing context, or it errors with
  `Missing required pricing context`. `content.ts` resolves the first region via
  `sdk.store.region.list()`. A **Spain/EUR** region exists.
- **Prices come in major units** (`4.5` = 4,50 €) — never divide by 100.
- A product must be in the **Default Sales Channel** (the one tied to the publishable key) or it
  won't appear in Store API results.

### Theming

Tailwind v4 CSS-first config in `apps/web/app/globals.css`: design tokens are CSS variables exposed
via `@theme inline` (e.g. `--color-primary`, `--color-accent`). Token values are the source of truth
in `design.md`. Fonts load in `app/layout.tsx` (Playfair Display = serif/display, DM Sans = UI,
local `Capture-It.ttf` = display accent via `.display-accent`).

## Infrastructure & environments

- **Postgres + Redis run permanently on a Raspberry Pi** (`192.168.1.19`) via `docker-compose.yml`
  with `restart: unless-stopped`. You usually do **not** run `pnpm infra:up` — only if the Pi
  rebooted or you need to force a restart. Medusa itself runs locally on the Mac.
- `docker-compose.yml` is deployed to the Pi by `.github/workflows/deploy-infra.yml` (self-hosted
  runner, triggered on changes to that file).
- Set `DATABASE_SSL_DISABLED=true` for the local Pi (no SSL); leave it unset in production (Neon).
  See `apps/backend/medusa-config.ts`.
- Env: `apps/web/.env.local` needs `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and
  `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (the `pk_...` key is created in the Medusa admin under
  Settings → Publishable API Keys). Both apps use `.npmrc` with `shamefully-hoist=true`.
- Production (future): Vercel (web) + Neon (Postgres) + Upstash (Redis).

### Common gotcha after `pnpm install`

The Medusa admin can break with "Failed to fetch dynamically imported module". Fix: delete
`apps/backend/node_modules/.vite`, restart Medusa, and hard-refresh the browser.
