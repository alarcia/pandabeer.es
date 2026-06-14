---
name: PandaBeer — Public website
description: "Public website for a craft brewery: showcase beers, brand content, events, and drive users to the shop."
tokens:
  colors:
    primary: "#f3b635"        # Golden amber — brand/accent
    background: "#ece9db"     # Warm beige — page background
    accent: "#2f2a24"         # Dark brown — text, dark areas
    secondary: "#5b6640"      # Olive green — sparing accent
    text: "#2f2a24"           # Primary readable text color
    surface: "#f7f4e8"        # Card / raised surface over the beige base
    surface-strong: "#ebe5d3" # Stronger surface (Tailwind: surface-container-high)
    outline: "rgba(47,42,36,0.14)"  # Hairline borders / dividers
    on-primary: "#2f2a24"     # Foreground on primary (amber) fills
    on-accent: "#ece9db"      # Foreground on accent (dark) fills
  typography:
    display:
      family: "Capture It, Playfair Display, Cormorant Garamond, Libre Baskerville, serif"
      weights: [700, 600]
    ui:
      family: "DM Sans, Inter, Raleway, system-ui, -apple-system, sans-serif"
      sizes:
        body: 16
        h1: 64
        h2: 40
        label: 12
  spacing:
    scale: [4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 120]
  radii:
    small: 6
    medium: 12
    round: 9999
  elevation:
    level0: 0
    level1: "0 1px 3px rgba(47,42,36,0.06)"
    level2: "0 6px 18px rgba(47,42,36,0.08)"
---

# Overview

This DESIGN.md describes the visual system for the PandaBeer public website. The site showcases beers, brand story, events, and drives users to the external shop. Tone is craft, warm, and approachable — not overly minimal nor flashy — prioritizing photography and clear CTAs.

## Colors

- **Primary / brand**: `primary` — #f3b635 (golden amber). Use for primary CTAs and brand highlights.
- **Background / base**: `background` — #ece9db (warm beige). Prefer to use instead of pure white for warmth.
- **Accent / text**: `accent` / `text` — #2f2a24 (dark brown). Body text on light backgrounds and dark section backgrounds.
- **Secondary**: `secondary` — #5b6640 (olive green). Very sparing: badges, style tags.
- **Surfaces & semantic tokens**: `surface` (#f7f4e8) for cards/raised panels and `surface-strong`
  (#ebe5d3, Tailwind `surface-container-high`) for stronger fills; `outline` for hairline borders
  and dividers. Use `on-primary` / `on-accent` as the foreground color over `primary` / `accent` fills.

Guidelines:

- Primary button: background `primary`, text `accent`.
- Dark section text: `background` on `accent` backgrounds for contrast.
- Avoid combining `primary` and `secondary` in the same component.

## Typography

- **Display / headings**: serif family (`Playfair Display` or similar). Bold/semibold weights for H1/H2 to evoke craft labels.
- **UI / body**: clean sans-serif — `DM Sans` is the font actually loaded (Inter as fallback).
  Body 16px with 1.6–1.8 line-height.
- **Scale examples**:
  - H1 hero: 56–72px (token `h1` 64)
  - H2 section: 36–44px (token `h2` 40)
  - Body: 16px
  - Labels / tags: 12–13px uppercase

## Layout

This design system uses a fixed editorial grid to control line length, image placement, and vertical rhythm across breakpoints.

- **Grid:** 12-column layout for desktop with 24px gutters; content centered within a 1280px max-width container.
- **Vertical rhythm:** generous vertical gaps (120px+) between major sections to create a premium, airy feel.
- **Mobile adaptivity:** on small screens the grid collapses to a single column with ~16px side margins; section padding reduces (see `spacing.scale`).
- **Editorial flow:** favor asymmetrical layouts where imagery and copy offset each other to create a magazine-like rhythm.

### Page structure (vertical scroll)

The site follows a clear vertical flow designed to showcase photography and drive users to the shop.

1 — Top navigation (sticky)

  - Thin bar that remains visible while scrolling. Background: solid or semi-transparent `accent` (`#2f2a24`).
  - Left: brand logo.
  - Center/right: nav links (Beers · About · Events · News).
  - Far right: prominent "Shop" CTA (amber) that opens the shop in a new tab.
  - Mobile: hamburger that expands a side panel or dropdown.

2 — Hero

  - High-impact section. Dark editorial surface (`accent`) with an atmospheric photo to the right or as a background.
  - Left: large display claim (serif), short subcopy, two CTAs: secondary (see our beers) and primary (go to shop — `primary` amber).
  - Right: featured image, optionally dynamic (seasonal / next event). On mobile the claim stacks above the image.

3 — Featured beers

  - Light section using `background` (`#ece9db`) with a 3–4 card grid of recent/popular beers. Each card: image, name, style, one-line blurb, CTA to shop.
  - Closing CTA: "See full catalogue →" linking to the shop.

4 — News / Instagram feed

  - Editorial grid (4–6 photos) surfaced as a live feed. CTA to follow on Instagram. Consider using the Instagram Graph API or an embed.
  - Use a dark surface (`accent`) for visual contrast where appropriate.

5 — Upcoming events

  - Compact list or cards with date, venue, and short description. "More info" CTA per event.

6 — The brand / The process

  - Editorial section (text + photography) describing origin and process. Use left/right or stacked layouts depending on breakpoint.

7 — Newsletter

  - Narrow sign-up strip with email input + CTA. Minimal legal copy.

8 — Footer

  - Dark background (`accent`) with columns: logo & tagline, nav links, social, contact/legal/age verification.

### Density & responsive notes

- Favor mobile-first spacing and gradually increase density on desktop.
- Use `spacing.scale` tokens to ensure consistent gaps between elements and sections.
- Reserve `primary` (`#f3b635`) for high-impact CTAs; use `secondary` sparingly for badges.


## Elevation & Depth

- Use subtle shadows: `elevation.level1` for small cards, `elevation.level2` for prominent overlays.
- Avoid heavy, multi-layered shadows; keep the aesthetic tactile and restrained.

## Shapes

- Corners: `radii.small` on UI elements, `radii.medium` for larger cards. Buttons can use `radii.round` for pill shapes.
- Imagery: photos are full-bleed or softly rounded cards; keep aspect ratios consistent for the beer grid.

## Components

- **Top navigation**: sticky bar, left logo, center/left nav links, right `Shop` button (amber).
- **Hero**: left-aligned claim, right image; CTAs: primary (amber) + secondary.
- **Beer card**: image, name, style, one-line blurb, CTA to shop.
- **Instagram grid**: 4–6 photos, CTA to follow; dark background variant available.
- **Event item**: compact card with date, venue, short description.
- **Newsletter**: single-line email input + CTA.

## Do's and Don'ts

- Do: prioritize photography and warm tones; keep animations subtle.
- Do: reserve `primary` for important CTAs only.
- Don't: use bright multicolor gradients or heavy neon tones.
- Don't: overuse `secondary` (olive) — it is decorative.

## Accessibility notes

- Ensure text contrast meets WCAG AA. Prefer `accent` on `background` for body text.
- Age-verification modal must not block SEO; implement as a client-side modal that does not prevent crawlers from indexing content.

---

For tooling: validate structural correctness with `npx @google/design.md lint design.md`, and
regenerate the Tailwind v4 `@theme` tokens with `npx @google/design.md export css-tailwind design.md`.

# Design brief — Craft brewery website

Corporate website for a craft brewery. The main goal is to present the brand, showcase the beer catalogue and drive users towards the online shop (separate URL) and the brand's Instagram account. The website is the brand's entry point, not the point of sale: it should convey character, authenticity and approachability.

Refer to the top-level sections for canonical `Colors` and `Typography` tokens; implementation detail and page structure are described above in `Layout` and `Components`.
