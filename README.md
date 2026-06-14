<div align="center">
  <h1><img src="apps/web/public/images/logo400.png" alt="Logo" height="40" valign="middle"> pandabeer.es </h1>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://www.medusajs.com/"><img src="https://img.shields.io/badge/Medusa-000000?logo=medusa&logoColor=white" alt="Medusa.js" /></a>
    <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" /></a>
  </p>

  <p align="center"><strong>Brand showcase site for a craft brewery — Next.js storefront backed by a Medusa backoffice</strong></p>
</div>

> [!WARNING]
> The live site at [pandabeer.es](https://pandabeer.es) currently runs on a basic WordPress
> setup. It will be replaced by this Next.js project. **This repo is a work in progress.**

## About

A craft brewery site in two halves. The **landing is a brand showcase** — brewery, beers, and
brand content. From there a **"Shop" button leads into the store**, where the actual ecommerce
lives (search, user accounts, cart, payments).

**Today** only the showcase exists and the "Shop" button points to an external URL. The store is
**planned under the same domain at `pandabeer.es/shop`** — one brand, one URL for the visitor. It's
the **last phase** of the project and the approach is still open (possibly the Medusa ecommerce
template, customized). The storefront already reads catalog and content from Medusa, but there is
no cart or checkout yet.

## Stack

- **Frontend** — Next.js 16, React 19, Tailwind CSS v4, TypeScript.
- **Backend** — Medusa.js v2 backoffice + Store API, consumed from the storefront via
  `@medusajs/js-sdk` on the server (good for SEO).
- **Infra** — PostgreSQL + Redis (Docker). Production target: Vercel + Neon + Upstash.

## Project layout

pnpm-workspace monorepo with two independently deployable units:

- `apps/web/` — Next.js storefront (`@pandabeer/web`), hand-built (not the Medusa starter).
- `apps/backend/` — Medusa.js v2 backoffice + Store API (`@pandabeer/medusa-backend`).

## Getting started

```bash
pnpm install

# Frontend — http://localhost:3000
pnpm dev

# Backend — Medusa, http://localhost:9000 (admin at /app)
pnpm backend:dev
pnpm backend:build      # production build
pnpm backend:start      # start the built app
pnpm backend:migrate    # run DB migrations

# Infra — Postgres + Redis via Docker
pnpm infra:up
pnpm infra:down
```

Copy the `.env.example` files (`apps/web/`, `apps/backend/`) to your local env files and fill in
the values before running. There is no test suite yet.

## Status

Early development. Working today: the showcase shell and the Medusa integration (featured beer
and "Currently Pouring" grid, with graceful fallback to static content when the backend is
unavailable). Planned, not yet built: the integrated **store** (search, accounts, cart, payments)
as a route in this project, plus brand pages, events, news and the Instagram feed.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/alarcia">alarcia</a></p>
</div>
