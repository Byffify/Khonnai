---
version: alpha
name: "eBay"
website: "https://www.ebay.com"
description: >-
  An online marketplace whose brand identity has been the same four-color letter-mark for thirty years — saturated red, cobalt blue, marigold yellow, and grass green spelling "ebay" in lowercase italic at the top-left of the page — while the surrounding chrome has thinned down to a near-monochrome system of ink graphite (#191919), white canvas, and a single secondary blue (#0968f6) reserved for the Search button. Below the brand bar the page reads as a product-photography catalog: row after row of square photo tiles at 16px rounding (the system's signature radius, used 90 times on the captured page), category labels in Market Sans at 12-14px, and price typography in tight 16px bold. The four-color logo carries the heritage; the surrounding system carries the late-2024 visual refresh ("expressive" theme tokens wired into every CSS variable).

seo:
  title: "eBay Design System for React — multicolor letter-mark, Market Sans, 18 components"
  metaDescription: "eBay's marketplace design system as a DESIGN.md file. Four-color logo (red, blue, yellow, green), Market Sans typography, 16px square tile radius, single cobalt CTA. Tokens for React, Next.js, and AI coding tools."
  highlights:
    - "Four-color logomark — red, blue, yellow, green letters spelling 'ebay' in italic lowercase, the system's only multicolor surface in chrome that has otherwise gone monochrome"
    - "16px square-photo radius — used 90 times on the captured page across every product tile, category card, and feature panel; the dominant shape token in the entire system"
    - "Cobalt Search button — #0968f6 with white text inside a 44px-rounded pill, the single saturated CTA in an otherwise ink-on-white chrome"
    - "Market Sans across every tier — eBay's proprietary sans does display, body, label, button, and price; no second family on the page"
    - "Expressive theme tokens — 200+ CSS custom properties wired into every component, with semantic names like --color-foreground-on-strong and --color-background-elevated"
  tags:
    - "Marketplaces"
    - "E-commerce & Retail"
  lastUpdated: "2026-05-18"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    eBay's marketing surface in 2026 is doing two things at once. The first is preserving a brand-recognition asset older than the iPhone — the four-letter "ebay" logomark in saturated red, cobalt blue, marigold yellow, and grass green, lowercase and slightly italicized, sitting at the top-left of every page the way it has since 1995. The second is wrapping that asset in a near-monochrome late-2024 system: ink-graphite text on a white canvas, hairline borders in light gray, a single secondary cobalt blue reserved for the Search button, and a 16px rounded-square product-tile radius used 90 times on the captured page. Where Amazon keeps its hero busy with promotional banners and a navy-on-orange palette, and where Etsy paints the whole canvas in its kraft-paper orange, eBay's marketing surface is structurally calm — the four-color logo carries every bit of brand voltage, and the surrounding chrome resigns from competing.

    The DESIGN.md file packages the system into a machine-readable spec for React tooling. Inside: 13 color tokens drawn from the 200+ CSS custom properties eBay's "expressive" theme exposes, organized into a single ink-graphite for body text and borders, three saturated brand letter-colors (red, blue, yellow, green) for the logomark, one cobalt blue for the primary CTA, a cobalt indigo for legal links, and a neutral gray ladder for surfaces; 13 typography tokens running Market Sans (eBay's proprietary sans) in two stack variants — Helvetica fallback for body and Arial fallback for display — across sizes 10px to 36px and weights 400-700; 5 radius tokens centered on 16px for product tiles and 44px for the Search-button pill; 8 spacing tokens on a 4px base; and 18 component definitions covering the cobalt Search button, the product-photo tile, the category card, the inline cyan nav-link, the announcement banner, and the four-column footer.

    Feed this file to an AI coding tool and it reproduces eBay's specific moves: monochrome ink-on-white chrome with one cobalt secondary, 16px rounded product photography as the dominant visual unit, Market Sans at modest weights, the four-color logomark as the sole multicolor brand surface, and the product-grid layout where row after row of square tiles share identical visual treatment so the category labels do the editorial work. The token references resolve cleanly — `{colors.brand-red}` for the R, `{colors.brand-blue}` for the b, `{colors.primary}` for the Search pill — so the AI never has to invent a value. Borrow the move only if your marketplace can carry the same restraint: if you need promotional banner real estate above the fold, the eBay chrome will feel anemic. The system trades shopper-side excitement for a calm browse surface that lets the photography do the selling.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www.ebay.com"
      title: "eBay — official site"
      description: "eBay's public marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What are eBay's primary brand colors?"
      answer: "eBay's brand identity is the four-color logomark — the letters 'ebay' in saturated red, cobalt blue, marigold yellow, and grass green, lowercase and slightly italicized. This is the system's only multicolor surface; the surrounding chrome has gone near-monochrome since the late-2024 visual refresh. Outside the logo, the page uses one secondary cobalt blue (#0968f6) for the Search button pill and the in-body Sign-in link, and a darker indigo (#003aa5) for legal-footer links. Every other surface is ink graphite #191919 on white. The four-color mark carries the brand-recognition asset; the secondary blue does the interactive work."
    - id: "typography"
      title: "What typeface does eBay use, and what should I use as a substitute?"
      answer: "eBay runs Market Sans, a proprietary humanist sans-serif commissioned for the brand, across every typographic tier — display, heading, body, button, and price label. The font ships with two fallback stacks: a Helvetica-first stack for body and nav (Market Sans, Helvetica, sans-serif), and an Arial-first stack for headlines and product titles (Market Sans, Arial, sans-serif). Display sits at 24-36px / weight 700; price labels at 16px / 700 with strikethrough comparison prices at 12px / 400; body at 12-16px / 400. The closest open-source substitutes are Inter for body (Helvetica fallback) and Source Sans 3 for display (Arial fallback) — both match the slightly-narrow Market Sans proportions at the 14-16px tier."
    - id: "tile-radius"
      title: "Why does eBay use 16px radius on every product tile?"
      answer: "The 16px radius is the system's signature shape token, used 90 times on the captured page across every product-photo tile, category card, deal card, trending tile, and feature panel. This is unusually generous for an e-commerce surface — Amazon uses 4-8px, Etsy uses 12px — and the choice softens what would otherwise be a punishing visual rhythm of stacked rectangles. The 16px arc shows clearly at typical thumbnail sizes (120-200px wide) and reads as a deliberate brand-consistency move rather than a default rounding. The Search button pill at 44px and the user-avatar at full-circle are the only other radius tiers; there is no 4px or 8px tight-corner moment."
    - id: "search-button"
      title: "Why is the Search button the only saturated blue on the page?"
      answer: "The Search button is the single most important interaction on a marketplace — every shopper journey starts there — and eBay's system holds the saturated cobalt blue (#0968f6) for that button alone in the captured chrome. The pill is 44px tall, 16px-rounded into a full pill, with white 14px / 700 'Search' text and 0px 20px padding. It sits at the right end of the header search bar, which itself uses a 40px-tall white-fill input with 44px rounding. The same cobalt appears once more in the page body as the 'Sign in' link color and once in the dark footer as the accent for legal links — but those are inline text occurrences, not surfaces. The pill is the only place the cobalt holds the foreground."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build my own marketplace site?"
      answer: "Yes — the file is designed to be fed into Claude, Cursor, or any AI tool that reads structured design tokens. The agent will reproduce eBay's specific moves: monochrome ink-on-white chrome with one cobalt secondary, 16px rounded product photography as the dominant visual unit, Market Sans at modest weights, and the product-grid rhythm where row after row of square tiles share identical visual treatment. The token references resolve cleanly without invention. One caveat: the four-color logomark only works as eBay's logomark — it carries 30 years of brand-recognition equity and cannot be transplanted. For your own site, use the structural tokens (ink, canvas, cobalt CTA, 16px tile radius) and design a single-color or single-mark logo of your own."

mockups:
  - "marketing-hero"
  - "media-grid"

colors:
  primary: "#0968f6"
  primary-dark: "#003aa5"
  brand-red: "#f02d2d"
  brand-blue: "#0968f6"
  brand-yellow: "#e3f13c"
  brand-green: "#92c821"
  ink: "#191919"
  ink-soft: "#41413f"
  ink-muted: "#555555"
  ink-faint: "#707070"
  canvas: "#ffffff"
  surface-1: "#e5e5e5"
  hairline: "#c7c7c7"
  hairline-medium: "#8f8f8f"
  shadow: "#000000"

typography:
  display-xl:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 46px
    letterSpacing: 0
  display-md:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: 0
  heading-sm:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0
  price-md:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: 0
  body-md:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0
  body-md-lead:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 22.86px
    letterSpacing: 0
  body-sm:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0
  label-bold:
    fontFamily: "\"Market Sans\", Helvetica, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 14px
    letterSpacing: 0
  caption:
    fontFamily: "\"Market Sans\", Helvetica, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0
  caption-bold:
    fontFamily: "\"Market Sans\", Helvetica, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 12px
    letterSpacing: 0
  caption-strike:
    fontFamily: "\"Market Sans\", Arial, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  micro:
    fontFamily: "\"Market Sans\", Helvetica, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16.5px
    letterSpacing: 0
  button-search:
    fontFamily: "\"Market Sans\", Helvetica, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 14px
    letterSpacing: 0

rounded:
  none: "0px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  pill: "44px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "30px"
  xl: "48px"
  2xl: "0px 48px"
  3xl: "60px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-search}"
    rounded: "{rounded.pill}"
    padding: "0px 20px"
    height: "44px"
    borderColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "32px"
    borderColor: "{colors.ink}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: "8px 0px"
    height: "48px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    padding: "0px 12px"
  link-cobalt:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
  search-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.shadow}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: "0px 0px 0px 44px"
    height: "40px"
    borderColor: "{colors.ink}"
  hero-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "0px"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "0px 0px 16px"
  body-paragraph:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-lead}"
  body-paragraph-muted:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
  product-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: "0px"
    borderColor: "{colors.surface-1}"
  category-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "16px"
    borderColor: "{colors.surface-1}"
  deal-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.none}"
    padding: "0px"
  price-current:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.price-md}"
  price-strike:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption-strike}"
  announcement-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "30px"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
    height: "44px"
    borderColor: "{colors.ink}"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "30px"
    borderColor: "{colors.surface-1}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-faint}"
    typography: "{typography.caption}"
    padding: "48px 0px"
---

## Overview

eBay's marketing surface in 2026 is doing two things at once. **Logo as heritage anchor.** The first is preserving a brand-recognition asset older than the iPhone — the four-letter "ebay" logomark in saturated red, cobalt blue, marigold yellow, and grass green, lowercase and slightly italicized, sitting at the top-left of every page the way it has since 1995. The second is wrapping that asset in a near-monochrome late-2024 system: ink-graphite text on a white canvas, hairline borders in light gray, a single secondary cobalt blue reserved for the Search button, and a 16px rounded-square product-tile radius used 90 times on the captured page. Where Amazon keeps its hero busy with promotional banners and a navy-on-orange palette, and where Etsy paints the whole canvas in its kraft-paper orange, eBay's surface is structurally calm — the four-color logo carries every bit of chromatic brand voltage, and the surrounding chrome resigns from competing.

The system's chromatic split is the central move. The four logomark letters use four saturated chromatic values — `{colors.brand-red}` for the e, `{colors.brand-blue}` for the b, `{colors.brand-yellow}` for the a, `{colors.brand-green}` for the y — each wired into the expressive theme as `--color-red-500`, `--color-blue-500`, `--color-avocado-400`, `--color-green-500`. These four hexes appear only inside the logomark. The rest of the chrome runs on a five-step neutral ladder: `{colors.ink}` graphite #191919 (frequency 858 — the dominant text and border color), `{colors.ink-soft}` near-black, `{colors.ink-muted}` mid-gray, `{colors.ink-faint}` light-gray, `{colors.canvas}` pure white. The only saturated value that escapes the logomark is `{colors.primary}` cobalt #0968f6, used 6 times — once as the Search button background, once as the Sign-in link color, three times as borders on the search-input field, and once in the body. The discipline is the inverse of what most marketplaces do; Amazon, Walmart, and Target all leak brand color into promotional banners, free-shipping callouts, and deal badges.

Typography is **Market Sans** across every tier — a proprietary humanist sans commissioned for eBay, shipped in two fallback variants (Helvetica-first for body and nav, Arial-first for display and product titles). Display sits at 24-36px / weight 700; price labels at 16px / 700; body at 12-16px / 400. There is no second family on the page.

**Key Characteristics:**
- Four-color logomark (`{colors.brand-red}` / `{colors.brand-blue}` / `{colors.brand-yellow}` / `{colors.brand-green}`) — the only multicolor surface in the chrome.
- Near-monochrome surrounding system: ink-graphite #191919 text on `{colors.canvas}` white, hairline borders in `{colors.hairline}` light-gray.
- Single secondary cobalt (`{colors.primary}` — #0968f6) reserved for the Search button pill and the Sign-in link.
- 16px square radius (`{rounded.md}`) on every product-photo tile, category card, deal card, and trending tile — used 90 times on the captured page.
- 44px pill radius (`{rounded.pill}`) on the Search button and the search-input field; full-circle on the user avatar; no 4-8px tight-corner tier.
- Market Sans across every typographic tier in two fallback stacks (Helvetica for body, Arial for display).
- Price typography: current price at 16px / 700, strikethrough comparison price at 12px / 400 in `{colors.ink-muted}` graphite.
- Multi-row product-grid rhythm: "The future in your hands" / "Today's Deals" / "Trending on eBay" — three identical photo-tile rows distinguished only by category heading.
- Cobalt promotional panel (`{colors.primary}` 30px-padded banner with white text) inside the announcement strip for service-disruption notices.

## Colors

### Brand (logomark)

- **eBay Red** (`{colors.brand-red}` — #f02d2d): wired as `--color-red-500` and `--color-brand-1`. The leading letter of the logomark. Appears in the chrome only inside the logomark itself; not used as a CTA color or banner fill.
- **eBay Blue** (`{colors.brand-blue}` — #0968f6): same hex as the primary CTA, wired as `--color-blue-500` and `--color-brand-2`. The second letter of the logomark and the system's only saturated interactive color.
- **eBay Yellow** (`{colors.brand-yellow}` — #e3f13c): wired as `--color-avocado-400`. The third letter — slightly olive-leaning rather than pure marigold, a softening of the original eBay yellow.
- **eBay Green** (`{colors.brand-green}` — #92c821): wired as `--color-green-500` and `--color-brand-4`. The fourth letter — a leafy spring green.

### Primary

- **Cobalt Primary** (`{colors.primary}` — #0968f6): frequency 6 — used as background (1) on the Search button, text (2) on the Sign-in link and accent labels, border (3) on the search-input field. Wired into 17 CSS variables including `--color-background-accent`, `--color-foreground-accent`, `--color-foreground-information`. The single saturated interactive surface on the page.
- **Cobalt Dark** (`{colors.primary-dark}` — #003aa5): frequency 18 — wired as `--color-blue-650` and `--color-foreground-link-legal`. Used for legal-footer links and hover states on the cobalt primary.

### Text

- **Ink** (`{colors.ink}` — #191919): frequency 858. Used as text (425), background (30), and border (403). The dominant text and border color across the system. Wired into 12 semantic variables including `--color-foreground-primary`, `--color-background-strong`, and `--expressive-theme-neutral-dark-background`.
- **Ink Soft** (`{colors.ink-soft}` — #41413f): frequency 2. Reserved for slightly warmer text accents.
- **Ink Muted** (`{colors.ink-muted}` — #555555): frequency 59 — used as text (35) and border (24). The strikethrough comparison-price color and the secondary label tone.
- **Ink Faint** (`{colors.ink-faint}` — #707070): frequency 239. Used as text (120) and border (119). Wired as `--color-foreground-secondary` and `--color-neutral-600`. The footer-text tone and the secondary metadata color.

### Surface

- **Canvas** (`{colors.canvas}` — #ffffff): frequency 26. Used as background (21) and text (3). The dominant page floor. Wired into 50+ semantic variables including `--color-background-primary` and `--color-background-elevated`.
- **Surface-1** (`{colors.surface-1}` — #e5e5e5): frequency 2 — used as borders on product tiles and category cards. Wired as `--color-background-tertiary` and `--color-border-subtle`.

### Hairline

- **Hairline** (`{colors.hairline}` — #c7c7c7): frequency 1 as border. Wired as `--color-stroke-disabled` and `--color-border-disabled`. The light-gray rule that separates footer columns from content.
- **Hairline Medium** (`{colors.hairline-medium}` — #8f8f8f): frequency 1 as border. Wired as `--color-stroke-default` and `--color-border-medium`. The default border tone for interactive states.

### Shadow

- **Shadow** (`{colors.shadow}` — #000000): frequency 60. Used as text (22), border (37), and shadow (1). Reserved for input-field text and a small set of state-layer overlays. Wired into 13 semantic variables including `--color-state-layer-hover` and `--color-scrim-background`.

## Typography

### Font Family

The system runs **Market Sans** for every typographic tier — a proprietary humanist sans-serif commissioned for the eBay brand. It ships in two fallback stack variants on the captured page:

- **Helvetica-first** (`"Market Sans", Helvetica, sans-serif`) — used on nav links, captions, micro-labels, and the Search button. Resolves to Helvetica on macOS / iOS, Arial via the broader stack on other platforms.
- **Arial-first** (`"Market Sans", Arial, sans-serif`) — used on display headings, body paragraphs, product titles, and price labels. Resolves to Arial on Windows / Linux, with Helvetica picked up implicitly via the `sans-serif` keyword on macOS.

The two-stack split is a small inconsistency in the system — body uses one fallback order while display uses another — but it does not change the rendered face on devices that have Market Sans available, which is the vast majority of authenticated eBay sessions where the font is cached.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-xl}` | 36px | 700 | 46px | "Shipping temporarily paused" announcement h2 |
| `{typography.display-md}` | 24px | 700 | 32px | "The future in your hands" / "Today's Deals" / "Trending on eBay" section headings |
| `{typography.heading-sm}` | 16px | 700 | 20px | In-card heading anchors and "Learn more" link labels |
| `{typography.price-md}` | 16px | 700 | 24px | Current price label on product tiles |
| `{typography.body-md}` | 16px | 400 | 24px | Default running text |
| `{typography.body-md-lead}` | 16px | 400 | 22.86px | Announcement-banner body paragraph |
| `{typography.body-sm}` | 14px | 400 | 20px | Product titles inside tiles |
| `{typography.label-bold}` | 14px | 700 | 14px | "Search" button label |
| `{typography.caption}` | 12px | 400 | 18px | Nav-link labels, footer labels |
| `{typography.caption-bold}` | 12px | 700 | 12px | "20% OFF: LONGWEEKEND" deal-tag label |
| `{typography.caption-strike}` | 12px | 400 | 16px | Strikethrough comparison price (`del` element) |
| `{typography.micro}` | 11px | 400 | 16.5px | Footer micro-labels, legal-link tier |
| `{typography.button-search}` | 14px | 700 | 14px | Search button text |

### Principles

Display weight is fixed at 700 across every heading tier — there is no editorial 500-weight moment the way Spline or Cloudflare ship. The 36px display headline is the loudest typographic moment in the system and appears only inside the announcement banner; standard section headings cap at 24px / 700. Body and labels share weight 400. Price typography is the system's distinctive contribution: current price at 16px / 700 sits inside an `<ins>` element, with a `<del>` strikethrough comparison price at 12px / 400 in muted graphite — the marketplace pattern that no other category needs.

### Note on Font Substitutes

Market Sans is proprietary to eBay. **Inter** at the same weights is the closest open-source substitute for the body tier; the slightly-narrow Market Sans proportions transfer cleanly to Inter's 14-16px sizes. For the display tier, **Source Sans 3** matches the Arial-fallback proportions at 24-36px. For the Helvetica-fallback body stack, the system fallback (Helvetica on macOS, Arial on Windows) is already what eBay ships when Market Sans is unavailable.

## Layout

### Spacing System

- **Base unit:** 4px (with 8px as the dominant module).
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 30px · `{spacing.xl}` 48px · `{spacing.3xl}` 60px.
- **Section padding (vertical):** ~48px between major product-grid rows, with 16px between the section heading and the first tile row.
- **Card internal padding:** 30px on the announcement banner; 16px on category cards; 0px on product-photo tiles (the photo extends edge-to-edge inside the rounded clip).
- **Header padding:** 0px 48px horizontal on the top utility nav.

### Grid & Container

- **Max content width:** ~1280px on the main editorial column, with the product-grid rows extending to the full viewport.
- **Top utility nav:** ink-graphite text on white canvas, with `My eBay`, `Brand Outlet`, `Gift Cards`, `Help & Contact` left-aligned and `Sell` / `Watchlist` / `Sign in` / `Register` / cart right-aligned at 12px / 400.
- **Brand bar:** four-color logomark left, full-width search-input field center (with the cobalt Search button at the right end), All-Categories dropdown after.
- **Announcement banner:** two-up split with text panel left and cobalt illustration panel right, 16px-rounded, 30px internal padding.
- **Product-grid row:** 6-7 tiles per row at desktop, each tile a 16px-rounded square photo with the product title underneath at 14px / 400 and the price at 16px / 700.
- **Footer:** four-column grid (Buy / Sell / eBay companies / About eBay) with `Stay connected` social icons in the third column and `Help & Contact` in the fourth.

### Rhythm

The page reads as a vertical scroll of three structurally-identical product-grid rows ("The future in your hands" / "Today's Deals" / "Trending on eBay") separated by the same 48px gap. There is no atmospheric color shift between rows, no background variation, no banner break between them — every section terminates on the same white canvas, and the only difference between rows is the heading text and the photography content. The repetition is the editorial rhythm.

## Elevation

The system uses a minimal shadow tier:

- **Flat (no shadow):** body, product tiles, category cards, the top nav, the brand bar, the announcement banner, and the footer — 95% of surfaces.
- **State-layer overlays:** `{colors.shadow}` at low opacity is wired into `--color-state-layer-hover`, `--color-state-layer-pressed`, `--color-state-layer-focus`, and `--color-state-layer-selected` as a thin semi-transparent black tint applied over the surface on interaction. There is no captured drop-shadow on the resting state of any card.
- **Data-viz tooltip shadow:** the only declared shadow color in the system is `--color-data-viz-tooltip-shadow-primary` and `--color-data-viz-tooltip-shadow-secondary`, both wired to `{colors.shadow}` at low opacity. These appear only inside chart tooltips on data-viz surfaces, not in marketing chrome.
- **Hairline borders:** `{colors.hairline}` (#c7c7c7) marks footer-column separators; `{colors.surface-1}` (#e5e5e5) marks the product-tile border.

## Shapes

The radius scale is **binary**: 16px square radius for every product surface, 44px pill for the Search button and input, with two small fallback tiers:

- `{rounded.none}` 0px — the deal-tag label, the top-nav text links, the strikethrough price.
- `{rounded.sm}` 8px — appears 5 times on small chip surfaces (the cart-count badge, certain in-card meta tags).
- `{rounded.md}` 16px — appears 90 times. The dominant shape token in the entire system. Every product-photo tile, category card, deal card, trending tile, announcement banner, and feature panel uses this radius.
- `{rounded.lg}` 20px — appears once on the All-Categories dropdown surface.
- `{rounded.pill}` 44px — appears 3 times: the Search button, the search-input field, and the user-avatar hit-target.
- `{rounded.full}` 9999px — captured as the 15984px value on user-avatar surfaces (effectively full-circle at any size).

There is no 4-8px tight-corner tier on product surfaces. The choice softens what would otherwise be a punishing visual rhythm of stacked rectangles in the product-grid rows — at typical thumbnail sizes (120-200px wide) the 16px arc is clearly visible and reads as a deliberate brand-consistency move rather than a CSS default.

## Components

**`button-primary`** — The Search button. Cobalt `{colors.primary}` #0968f6 fill, white text in `{typography.button-search}` (14px / 700), `{rounded.pill}` 44px radius, 0px 20px padding, 44px height. The single saturated CTA on the page; sits at the right end of the brand-bar search input.

**`button-secondary`** — Ink-on-white inline pill, `{rounded.pill}` radius, 8px 16px padding, 32px height, 1px `{colors.ink}` border. Used for "Learn more" inside the announcement banner.

**`top-nav`** — Plain white canvas with ink-graphite inline-text utility links at 12px / 400. Left cluster: My eBay, Brand Outlet, Gift Cards, Help & Contact. Right cluster: Sell, Watchlist, Sign in / Register, cart. 0px 48px horizontal padding, 8px vertical.

**`nav-link`** — Ink-graphite text at `{typography.caption}` (12px / 400), 0px 12px padding. No hover background visible at rest; hover applies the `--color-state-layer-hover` semi-transparent overlay.

**`link-cobalt`** — Inline cobalt link inside the utility nav, used on the "Sign in" anchor specifically. `{colors.primary}` text at 12px / 400. The only cobalt-text moment in the captured chrome outside the legal-footer tier.

**`search-input`** — White fill, shadow-black text at `{typography.body-md}` (16px / 400), `{rounded.pill}` 44px radius, 0px 0px 0px 44px padding (the left padding accommodates the search-icon), 40px height, 1px `{colors.ink}` border. Spans the full brand-bar width up to the cobalt Search button.

**`hero-heading`** — Ink-graphite text at `{typography.display-xl}` (36px / 700 / 46px line-height). Used on the "Shipping temporarily paused" announcement-banner h2.

**`section-heading`** — Ink-graphite text at `{typography.display-md}` (24px / 700). Used for "The future in your hands", "Today's Deals — All with free shipping", "Trending on eBay".

**`body-paragraph`** — Default ink text at `{typography.body-md-lead}` (16px / 400 / 22.86px line-height). The slightly-tighter line-height on the lead variant is the announcement-banner body treatment.

**`body-paragraph-muted`** — `{colors.ink-muted}` text at `{typography.body-sm}` (14px / 400) for secondary labels and product titles inside tiles.

**`product-tile`** — White fill, ink text, `{rounded.md}` 16px radius, 0px padding (the product photo extends edge-to-edge inside the rounded clip), 1px `{colors.surface-1}` border. Below the photo the tile renders the product title in `{typography.body-sm}` and the price in `{typography.price-md}`. Used in every row across the page.

**`category-card`** — White fill, ink text, `{rounded.md}` 16px radius, 16px internal padding, 1px `{colors.surface-1}` border. Used in "The future in your hands" row for category-photo cards (Laptops, Computer parts, Smartphones, Enterprise networking, Tablets and eBooks, Storage and blank media, Lenses and filters).

**`deal-tag`** — Transparent fill, ink text at `{typography.caption-bold}` (12px / 700). Used on the "20% OFF: LONGWEEKEND" label inside Today's Deals tiles. No background fill, no border — the tag is text-only emphasis.

**`price-current`** — Ink text at `{typography.price-md}` (16px / 700). Wrapped in an `<ins>` element semantically.

**`price-strike`** — `{colors.ink-muted}` text at `{typography.caption-strike}` (12px / 400). Wrapped in a `<del>` element — the strikethrough is browser-default rather than CSS-applied.

**`announcement-banner`** — Two-up split panel with the text-side using white fill and ink text, and the illustration-side using cobalt `{colors.primary}` fill with a white globe-icon illustration. `{rounded.md}` 16px radius, 30px internal padding. The two-panel split is the system's primary editorial unit for time-sensitive notices.

**`text-input`** — White fill, ink text at `{typography.body-md}` (16px / 400), `{rounded.pill}` 44px radius, 12px 16px padding, 44px height, 1px `{colors.ink}` border. Same treatment as the search input.

**`card`** — White fill, ink text, `{rounded.md}` 16px radius, 30px internal padding, 1px `{colors.surface-1}` border. The generic card surface that the announcement banner, the trending tile, and the category card all inherit from.

**`footer`** — White canvas, ink-faint text at `{typography.caption}` (12px / 400). Four-column layout (Buy / Sell / eBay companies / About eBay) with social-icon row in the third column. 48px outer padding, no surface contrast against the page floor.

## Do's and Don'ts

**Do** treat the four-color logomark as untouchable heritage. The R / b / a / y letter-colors carry 30 years of brand-recognition equity; replacing them with a monochrome wordmark or recoloring them into a single brand voltage would discard the central recognition asset.

**Do** reserve the cobalt `{colors.primary}` #0968f6 for the Search button and the Sign-in link only. The single saturated CTA in an otherwise monochrome surface is what gives the Search button its visual weight. Multiplying cobalt fills across promotional banners would dilute the only chromatic CTA signal.

**Do** use the 16px square radius (`{rounded.md}`) on every product surface. The 90 instances of this radius on the captured page are the system's signature shape consistency; introducing 4px or 8px corners on product tiles would break the rhythm.

**Do** keep display weight at 700 for headlines and 700 for current-price labels. The price-as-headline typography is what makes the marketplace surface read as a marketplace; softening the price to 400 would lose the scanning rhythm.

**Don't** introduce a 4px or 8px tight-corner radius tier on product surfaces. The system is deliberately binary — 16px square for products, 44px pill for the Search button — and adding a tight-corner tier would feel borrowed from a dev-tools system (Vercel, Linear) rather than from eBay's marketplace identity.

**Don't** add promotional banner color (Amazon orange, Walmart blue) to feature panels above the fold. The announcement banner uses cobalt `{colors.primary}` for service-disruption notices only; using it for promotional inventory would conflict with the single-CTA-color discipline.

**Don't** recolor the strikethrough comparison price to the brand cobalt to draw attention. The strikethrough lives in `{colors.ink-muted}` graphite #555555 specifically so the eye reads the current price first. Coloring the strike would invert the price hierarchy.

**Don't** swap Market Sans for a generic geometric sans like Poppins or DM Sans. The slightly-narrow humanist proportions of Market Sans are part of the marketplace's identity; geometric replacements feel borrowed from fintech and read wrong at the 12-14px tier where the marketplace lives.

## Known Gaps

- **Hover and focus states:** the state-layer overlay system (`--color-state-layer-hover`, `--color-state-layer-pressed`, `--color-state-layer-focus`) is declared but the specific applied opacity values are not exposed on the captured marketing surface.
- **Dark mode:** the captured surface is light-only. The expressive theme defines `--expressive-theme-neutral-dark-background` (mapped to ink #191919) suggesting a dark variant exists in the design-system source, but the marketing site renders light-only.
- **Localized currency formatting:** price typography is captured at USD only. The system likely has per-locale price-label variants (€, £, ¥, etc.) but only the USD strikethrough pattern appears in the captured surface.
- **Motion:** the page has minimal captured animation — no scroll-driven motion, no hero entrance, no carousel auto-advance. The product-grid rows scroll horizontally on hover but the transition curve is not exposed.
- **Authenticated surfaces:** this DESIGN.md captures the unauthenticated homepage only. The signed-in My eBay / Watchlist / Cart surfaces carry a much richer token system — notification badges, saved-search chips, recently-viewed rails — that is not represented here.
- **Expressive-theme color tokens:** the page declares hundreds of CSS custom properties for an "expressive" color theme (avocado, kiwi, jade, dijon, marigold, coral, lilac, indigo, violet, teal, pink, marketing-magenta) that are not rendered in the captured chrome. These appear to be reserved for data-viz surfaces, category-specific theming, and promotional event campaigns.
- **Data-viz palette:** chart-specific tokens (`--color-data-viz-line-chart-primary` through `quinary`, `--color-data-viz-trend-positive`, `--color-data-viz-chart-tertiary-stroke`) define a full chart palette that does not appear in the marketing surface.
