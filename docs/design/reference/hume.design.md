---
version: alpha
name: "Hume"
website: "https://www.hume.ai"
description: >-
  An emotional intelligence AI platform whose warm cream canvas and pastel spectrum — soft lavender (#c094e4), blush pink (#f7bbe6), amber orange (#ffb760), sky blue (#7fb8ef), and mint (#85e4c5) — form a deliberate emotional-register palette spread across cards and gradient orbs, while the body is anchored in near-black (#222222) running Fellix at weight 520 for headings and PP Fraktion Mono in uppercase for all labels and buttons, creating a rare hybrid where scientific rigor and emotional warmth share one visual surface.

seo:
  title: "Hume AI Design System for React — pastel spectrum on cream, Fellix + PP Fraktion Mono, 16 components"
  metaDescription: "Hume's design system pairs a soft cream canvas with a named pastel spectrum (lavender, blush, amber, sky, mint) and monospace uppercase labels. Tokens for React, Next.js, and AI coding tools via DESIGN.md."
  highlights:
    - "Pastel emotion spectrum — six named accent colors (lavender, pink, orange, blue, mint, coral) used as card backgrounds and gradient orbs rather than as CTA fills"
    - "PP Fraktion Mono in uppercase for all labels and buttons — the only monospace-as-UI-voice system in the AI-platform category"
    - "Fellix weight 520 — a non-standard weight between regular and semibold that softens headings without reaching bold"
    - "Warm cream canvas (#ffffff resolved from #fff9f3) keeps the emotional palette reading as inviting rather than clinical"
    - "Full-bleed pastel gradient section at the page bottom — the only brand-color background surface in the system"
  tags:
    - "AI & LLM Platforms"
  lastUpdated: "2026-05-18"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Hume's marketing surface makes a claim through color that its text repeats in words: emotions have distinct identities, and each one deserves its own hue. The page runs a warm cream canvas — not white, not gray, a cream that reads as body-temperature — and against that ground it places six named pastel accents: lavender for classification, blush pink for empathy, amber orange for energy, sky blue for analysis, mint for calm, and coral for alertness. These aren't decorative; they're the visual vocabulary of Hume's Emotional Intelligence API, where each color labels a distinct emotion dimension in the research product. Where competing AI voice platforms (ElevenLabs, Play.ai, Cartesia) reach for dark canvases and high-voltage CTAs to signal technical authority, Hume reaches for softness and warmth as the primary credibility signal.

    The DESIGN.md file packages the system into a machine-readable spec. Inside: 15 color tokens covering the cream canvas, near-black ink, and the full six-color emotion spectrum; 12 typography tokens spanning Fellix (the custom humanist sans at the signature weight 520) and PP Fraktion Mono (the uppercase monospace running every label, button, and navigation item); 5 border-radius tokens from pill-shaped 9999px buttons to 24px cards; 8 spacing values; and 16 component definitions including the pill-CTA button in near-black, the horizontal comparison chart, and the pastel-gradient full-bleed footer section.

    Feed this file to an AI coding tool and it reproduces Hume's specific moves: warm cream instead of white, six distinct pastel accents used as surface tints rather than as interactive fills, PP Fraktion Mono in uppercase for every label-sized text, and Fellix at 520 weight for headings that stop short of bold authority. The system rewards study if you're building an AI product that must read as technically grounded and emotionally trustworthy at the same time — it is one of the few examples in the category that achieves both without compromising either.

  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://www.hume.ai"
      title: "Hume — official site"
      description: "Hume's public marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Hume's primary brand color?"
      answer: "Hume does not use a single primary voltage color the way Airbnb uses Rausch or Linear uses indigo. Instead, the brand runs a six-color pastel spectrum — lavender (#c094e4), blush pink (#f7bbe6), amber orange (#ffb760), sky blue (#7fb8ef), mint (#85e4c5), and coral (#f89d6b) — each representing a distinct emotional register in the product. The primary CTA button uses near-black (#222222) fill with cream text, not any of the pastels. The pastels appear as card backgrounds and gradient orbs, not as interactive fills. If you must pick one color as the brand signature, lavender (#c094e4) appears most frequently among the brand-layer colors with 17 total occurrences, but it shares the stage with its five siblings."
    - id: "typography"
      title: "What typefaces does Hume use, and what are the best substitutes?"
      answer: "Hume's system runs two typefaces in strict separation. Fellix (a custom humanist sans-serif) handles all headings and body text at the distinctive weight 520 — a non-standard interpolation between regular and semibold that the Fellix variable font supports. PP Fraktion Mono (a monospace face from Pangram Pangram) renders all labels, navigation items, and button text in uppercase. The weight-520 Fellix heading is the brand's typographic signature. For substitutes: Plus Jakarta Sans at weight 500 matches Fellix's character width and humanist warmth at heading sizes; IBM Plex Mono in uppercase at weight 400 is the closest available substitute for PP Fraktion Mono's uppercase label voice."
    - id: "canvas-color"
      title: "Is Hume's background pure white or a tinted cream?"
      answer: "The CSS variable --background is declared as #fff9f3, a warm cream with a faint amber tint. The extractor clusters it with pure white (#ffffff) since the perceptual difference is minor, but the intentional value is the warm cream. This choice is deliberate — it shifts the page from a clinical, lab-grade feel toward something more body-temperature and approachable, which is essential for a brand whose product proposition is that AI should understand human emotion. Paired with the pastel accent cards, the warm canvas keeps the emotional palette reading as inviting rather than analytical."
    - id: "how-to-use-pastels"
      title: "How should I use Hume's pastel colors — as text, background, or border?"
      answer: "Hume's pastels function exclusively as surface tints and gradient orbs, not as text or interactive fill colors. Lavender (#c094e4) appears 7 times as text, 2 times as bg, and 7 times as border in the extraction — but the 'text' and 'border' readings are from the gradient-orb SVG edges, not from UI text. In practice: use the pastels as card background fills (the horizontal comparison chart rows), as gradient stops in decorative orbs, and as the background of the full-bleed bottom section. Never use them as button fills or inline text on the cream canvas — the near-black (#222222) primary button and the cream text-on-pastel pairing are the only sanctioned color combinations for interactive surfaces."
    - id: "uppercase-labels"
      title: "Why does Hume use PP Fraktion Mono in uppercase for labels and buttons?"
      answer: "Every navigation link, button label, section tag, and metadata label on Hume's marketing page runs PP Fraktion Mono at 12-14px in uppercase. This is not a default; it is the brand's scientific-register signal. Monospace uppercase text reads as categorized, measured, and precise — it borrows the visual grammar of research notation and data tables. Against Fellix's warm humanist headings and the pastel card surfaces, the mono uppercase labels create a productive tension: emotionally warm macro, technically rigorous micro. The button text 'CONTACT RESEARCH' in 14px Fraktion Mono uppercase on a near-black pill is the most concentrated expression of this duality."

mockups:
  - "marketing-hero"
  - "chat-conversation"

colors:
  ink: "#222222"
  canvas: "#ffffff"
  primary: "#c094e4"
  accent-pink: "#f7bbe6"
  accent-orange: "#ffb760"
  accent-blue: "#7fb8ef"
  accent-mint: "#85e4c5"
  accent-coral: "#f89d6b"
  accent-magenta: "#ea93f3"
  accent-sky: "#9ddbfb"
  accent-green: "#7bd289"
  accent-lime: "#c1d581"
  surface-lavender: "#f0e0f0"
  surface-peach: "#fde8e0"
  ink-zero: "#000000"

typography:
  display-xl:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 48px
    fontWeight: 520
    lineHeight: 48px
    letterSpacing: "-1.2px"
  display-lg:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 36px
    fontWeight: 520
    lineHeight: 40px
    letterSpacing: "-0.9px"
  display-md:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 520
    lineHeight: 36px
    letterSpacing: "-0.75px"
  heading-lg:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 520
    lineHeight: 32px
    letterSpacing: "-0.6px"
  heading-md:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 520
    lineHeight: 25px
    letterSpacing: "-0.5px"
  heading-sm:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 520
    lineHeight: 28px
    letterSpacing: "-0.45px"
  heading-xs:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 520
    lineHeight: 24px
    letterSpacing: "-0.4px"
  body-lg:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0
  body-md:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0
  body-sm:
    fontFamily: "Fellix, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 19.5px
    letterSpacing: 0
  label-mono:
    fontFamily: "\"PP Fraktion Mono\", ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: "0.35px"
  label-mono-sm:
    fontFamily: "\"PP Fraktion Mono\", ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: "0.3px"
  label-mono-xs:
    fontFamily: "\"PP Fraktion Mono\", ui-monospace, monospace"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 15px
    letterSpacing: "0.25px"

rounded:
  none: "0px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    height: "36px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    height: "36px"
    borderColor: "{colors.ink}"
  button-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
    height: "44px"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    padding: "0px 32px"
    height: "56px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    padding: "0"
  hero-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "0"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "0"
  body-paragraph:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "0"
  section-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-mono}"
    padding: "0"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "16px"
    borderColor: "{colors.ink}"
  card-lavender:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-peach:
    backgroundColor: "{colors.accent-orange}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "16px"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.full}"
    padding: "12px 48px 12px 20px"
    height: "48px"
    borderColor: "{colors.ink}"
  stat-number:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "0"
  tag-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label-mono-sm}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
    borderColor: "{colors.ink}"
  footer-section:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "64px 32px"
---

## Overview

Hume's marketing site arrives at an answer few AI brands attempt: that scientific rigor and emotional warmth can coexist on the same page without either conceding to the other. **Emotional register as palette.** The six pastel accents — lavender, blush pink, amber orange, sky blue, mint, and coral — are not arbitrary decoration; they are the visual naming system of Hume's Emotional Intelligence API, where each hue corresponds to a distinct emotion dimension the model tracks. The warm cream canvas keeps this spectrum from reading as clinical, the way a pure-white lab ground would. Where voice-AI competitors like ElevenLabs and Cartesia reach for dark canvases and high-saturation CTAs to signal technical power, Hume reaches for warmth and multiplicity.

Typography reinforces the tension. Fellix — a custom humanist sans — runs headings at the non-standard weight 520, stopping precisely between regular and semibold to avoid the authoritative push that weight 600+ would deliver. Every label, button, and navigation item runs PP Fraktion Mono in uppercase: the mono uppercase is the scientific-register signal, the thin-stroked humanist heading is the empathy signal, and the two never trade places.

**Key Characteristics:**
- Warm cream canvas (resolved from #fff9f3) rather than clinical white, maintaining body-temperature approachability against the pastel emotion spectrum.
- Six named pastel accents used as card fills and gradient orbs — never as interactive fill on buttons or links.
- PP Fraktion Mono uppercase runs every label-sized and button-sized text, creating the scientific-register micro-voice.
- Fellix at weight 520 for all headings — a variable-font interpolation that lands between regular and semibold.
- Near-black (#222222) pill buttons with cream text are the only interactive fill in the system.
- Full-bleed lavender-to-pink gradient footer band — the single section where pastel becomes structural background rather than card tint.
- No shadow tier; card depth comes from hairline borders on the cream canvas.

## Colors

### Brand Pastels

- **Lavender** (`#c094e4` — frequency 17): Used as text (7), bg (2), border (7). The highest-frequency brand color; labels the emotional-classification dimension and serves as the footer gradient anchor. The brand's most recognizable pastel.
- **Blush Pink** (`#f7bbe6` — frequency 5): Used as bg (2), border (1), gradient (1). Empathy register; appears in card backgrounds and the gradient orb cluster in the hero.
- **Amber Orange** (`#ffb760` — frequency 5): Used as bg (2), border (1), gradient (1). Energy register; the warmest accent, anchoring the peach card variant.
- **Sky Blue** (`#7fb8ef` — frequency 3): Used as bg (1), border (1). Analysis register; appears in card tints and the feature icon set.
- **Mint** (`#85e4c5` — frequency 3): Used as bg (1), border (1). Calm register; the most desaturated accent in the spectrum.
- **Coral** (`#f89d6b` — frequency 3): Used as bg (1), border (1). Alertness register; sits between the orange and the pink in the emotional temperature sequence.
- **Magenta** (`#ea93f3` — frequency 1): Used as bg (1). Supplementary accent; appears in one gradient orb below the fold.
- **Sky Light** (`#9ddbfb` — frequency 1): Used as bg (1). Lighter blue variant in the data visualization section.
- **Green** (`#7bd289` — frequency 1): Used as bg (1). Positive-valence accent; appears in the model-comparison chart rows.
- **Lime** (`#c1d581` — frequency 1): Used as bg (1). Curiosity register; the most yellow-shifted accent.

### Structural

- **Ink** (`#222222` — frequency 323): Used as text (157), bg (9), border (157). The primary text color and the primary CTA button fill — the only dark-on-cream interactive pattern in the system.
- **Canvas** (`#ffffff` — frequency 102): Used as text (45), bg (14), border (43). The near-white cream canvas, resolving from #fff9f3 in the CSS variable but landing perceptually as warm white.
- **Surface Lavender** (`#f0e0f0` — frequency 2): Used in gradient (2). Pale lavender tint; appears in the footer gradient band as the lighter stop.
- **Surface Peach** (`#fde8e0` — frequency 2): Used in gradient (2). Pale peach tint; appears in the warm card zone in the data section.
- **Pure Black** (`#000000` — frequency 2): Used as text (1), border (1). Appears only in gradient stops; not in UI chrome.

## Typography

### Font Families

The system runs two typefaces in strict role separation. **Fellix** (custom humanist sans-serif, wired as `--font-sans` and `--default-font-family`) handles every heading and body text. **PP Fraktion Mono** (from Pangram Pangram, wired as `--font-mono` and `--default-mono-font-family`) handles every label, button, tag, and navigation item — always uppercase, always at weight 400.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `display-xl` | 48px | 520 | 48px | Hero h1 |
| `display-lg` | 36px | 520 | 40px | Section pull-quote |
| `display-md` | 30px | 520 | 36px | Section h2 |
| `heading-lg` | 24px | 520 | 32px | Sub-section h2 |
| `heading-md` | 20px | 520 | 25px | Card titles, h3 |
| `heading-sm` | 18px | 520 | 28px | Smaller card h3 |
| `heading-xs` | 16px | 520 | 24px | Compact h3 |
| `body-lg` | 16px | 400 | 24px | Navigation links, standard prose |
| `body-md` | 14px | 400 | 20px | Card body, default running text |
| `body-sm` | 12px | 400 | 19.5px | Captions, small descriptors |
| `label-mono` | 14px | 400 | 20px | Buttons, nav labels (uppercase) |
| `label-mono-sm` | 12px | 400 | 16px | Section tags, chips (uppercase) |
| `label-mono-xs` | 10px | 400 | 15px | Micro labels (uppercase) |

### Weight 520 and Substitutes

Fellix's weight 520 is a variable-font interpolation that exists between regular (400) and semibold (600). It softens headings without the authority push of weight 600+. **Plus Jakarta Sans at weight 500** is the closest open substitute for the heading voice; **IBM Plex Mono** in uppercase at weight 400 approximates PP Fraktion Mono's label cadence. Geist Mono is also acceptable for the label mono tier.

## Layout

The page uses a centered single-column content column with a maximum width of roughly 1200px, with internal sections switching between two-column and three-column card grids. Section vertical spacing follows a generous rhythm: the hero runs 160px top padding, major sections use 48-64px vertical padding, and card grids pad internally at 16-24px.

- **Base unit:** 4px (8px dominant module, 16px base).
- **Card padding:** `spacing.base` (16px) on compact cards; `spacing.lg` (24px) on larger feature cards.
- **Section padding:** `spacing.2xl` (48px) vertical minimum between sections.
- **Hero horizontal:** 32px rail with the heading constrained to roughly 960px.

The comparison chart section uses a distinctive horizontal bar layout where model names run a left column and colored bars extend rightward — the pastel accent colors tag each model provider with a distinct bar color, one of the few places brand pastels function as data encoding.

## Elevation

The system carries **no shadow tier**. Elevation on the warm cream canvas is communicated exclusively through hairline borders: cards use a 1px near-black (#222222) border at rounded.md or rounded.lg radius. The absence of shadows keeps the surface reading as a flat, printed-paper aesthetic rather than a soft-light UI. The only depth effect is the subtle pastel card fills lifting certain content blocks against the cream ground through color contrast alone, not through drop shadow.

## Shapes

The radius scale spans from pill buttons to square hero images:

- `rounded.none` (0px) — not used in UI chrome; only for straight-edged image frames.
- `rounded.sm` (8px) — small chips, tags, compact UI elements.
- `rounded.md` (12px) — standard cards and mid-size containers.
- `rounded.lg` (16px) — larger feature cards and data visualization containers.
- `rounded.xl` (24px) — the largest card format, used on the full-bleed gradient sections.
- `rounded.full` (9999px) — all buttons. Every CTA in the system is pill-shaped; there are no rectangular buttons.

The pill button is the system's most consistent shape signal. At 36px height for compact CTAs and 48px for hero CTAs, all filled with near-black, the pill shape runs from the top-nav "Contact Research" button through every in-page action. The pill reads as approachable rather than corporate — consistent with the brand's warmth positioning.

## Components

**`button-primary`** — Near-black (#222222) pill, cream-white text in PP Fraktion Mono uppercase 14px, 9999px radius, 8x16 padding, 36px height. "CONTACT RESEARCH" is the canonical nav instance. The only interactive fill color in the system — pastels never appear as button fills.

**`button-secondary`** — Transparent fill, near-black text and 1px near-black border, same pill geometry. Used for "LEARN MORE" and secondary page actions.

**`button-cta`** — Taller pill (44px) version of button-primary, 12x24 padding, used in the hero zone for the primary conversion action.

**`top-nav`** — Cream canvas background, 56px height, 32px horizontal padding. Houses the Hume wordmark at left, navigation links in 16px Fellix body at center, and the near-black "CONTACT RESEARCH" pill at right. No divider line — the nav sits flush with the cream canvas.

**`nav-link`** — Transparent, near-black Fellix 16px weight 400, no padding decoration. No uppercase treatment — one of the few places in the nav where Fellix rather than Fraktion Mono runs.

**`hero-heading`** — Near-black Fellix 48px weight 520, letter-spacing -1.2px. The "Emotional Intelligence" fragment of the h1 renders in lavender (#c094e4) inline — the one place a brand pastel highlights text rather than fills a surface.

**`section-heading`** — Fellix 30px weight 520, near-black, -0.75px tracking. Introduces major content sections ("Running Human Studies Has Never Been Easier", "Train on the Best Voice AI Data").

**`body-paragraph`** — Fellix 14px weight 400, near-black, standard line height. The workhorse prose throughout the page.

**`section-label`** — PP Fraktion Mono 14px uppercase, near-black. Labels content sections ("HUME FEEDBACK API", "DATA", "MODELS") — the mono uppercase as organizational taxonomy signal.

**`card`** — Cream fill, 1px near-black hairline border, 16px internal padding, 16px radius. The default content card on the cream canvas.

**`card-lavender`** — Lavender (#c094e4) fill, 16px radius, 16px padding. Used for featured comparison chart rows and highlight cards.

**`card-peach`** — Amber orange (#ffb760) fill, 16px radius, 16px padding. Warm-register variant for energy-tone feature cards.

**`text-input`** — Cream fill, white text, 9999px pill radius, 12x48x12x20 padding, 48px height. The email capture field in the footer "Stay in the loop" section. Pill input matches the pill button geometry.

**`stat-number`** — Fellix 30px weight 520, near-black. Used for the "50+ languages", "48+ emotions", "600+ audio descriptions" stats above the comparison section.

**`tag-chip`** — PP Fraktion Mono 12px uppercase, transparent fill, 1px near-black border, pill radius, 4x12 padding. Section taxonomy tags.

**`footer-section`** — Full-bleed lavender (#c094e4) to pink gradient background, near-black text, 64x32 padding. The page's single pastel-as-structure moment, where the emotion palette becomes the dominant ground rather than a card tint.

## Do's and Don'ts

**Do** keep PP Fraktion Mono uppercase for every label, button, and navigational element. The mono uppercase is Hume's scientific-register micro-voice — switching to Fellix or Title Case in these slots removes the tension between the warm headings and the precise labels that defines the brand.

**Do** use the six pastel colors exclusively as surface fills and gradient stops. The system assigns each pastel to a semantic emotional register; use lavender for classification contexts, amber orange for energy contexts, and sky blue for analytical contexts to maintain the encoding logic.

**Do** use hairline borders (1px near-black on cream) rather than shadows for card elevation. The flat hairline aesthetic reads as research-grade precision — adding drop shadows shifts the page toward consumer-app softness that undercuts the scientific credibility.

**Do** keep the heading weight at 520 via the Fellix variable font, or at weight 500 on the substitute. Bumping to 600+ crosses into editorial authority that conflicts with the brand's empathy positioning.

**Don't** fill any button with a pastel color. Buttons in this system are near-black on cream, never lavender or mint — if you use `{colors.primary}` (#c094e4) as a button fill, the interactive grammar collapses into decoration and the scarcity that gives the pastels emotional weight disappears.

**Don't** use `{colors.accent-orange}` (#ffb760) as a link or text color. Its frequency of 1 in the text role comes from a gradient SVG edge, not from readable text. At 14px on cream it fails WCAG AA contrast.

**Don't** introduce a rectangular button variant. Every CTA in the system is `{rounded.full}` (9999px) — mixing pill buttons with 8px or 12px-radius buttons would import a visual grammar from a different design system entirely.

**Don't** replace the warm cream canvas (#fff9f3) with pure white (#ffffff). The half-degree warmth difference is precisely what keeps the six-color pastel spectrum reading as inviting rather than clinical. On pure white, the pastels look like a child's palette; on warm cream they read as intentional emotional registers.

## Known Gaps

- **Hover and focus states:** the extraction captured resting states only. Hover variants for the pill buttons, nav links, and comparison chart rows are not documented here.
- **Dark mode:** the marketing surface is light-only. The Hume EVI product interface may carry a dark theme not represented in this file.
- **Motion:** the pastel gradient orbs in the hero animate (radial pulse and drift), but the spec captures end-state values only. Easing and timing parameters are not documented.
- **Form states:** the email input resting state is captured; error, focused, and filled states are absent.
- **Chart internals:** the horizontal comparison bar chart uses pastel-coded model bars. The specific color assignments per model provider are not mapped here — they may change with model updates.
- **Responsive breakpoints:** the desktop-1440px layout is captured; mobile and tablet column collapse behavior is not documented.
- **Sub-brand assets:** the Hume EVI product icon, the Study Runner sub-product, and the Data Library have distinct visual treatments not fully captured from the marketing surface.
