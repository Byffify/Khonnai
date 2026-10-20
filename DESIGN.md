---
name: Khonnai · คนใน
description: White operational workspace with Fastwork foundations and Khonnai navy/orange branding.
colors:
  primary: "#193b5a"
  primary-dark: "#193b5a"
  action: "#193b5a"
  action-hover: "#102d47"
  action-surface: "#eaf0f5"
  add: "#ed7c32"
  add-hover: "#f58a43"
  add-ink: "#102d47"
  add-surface: "#fff0e3"
  nav-surface: "#ffffff"
  nav-glass: "radial-gradient(70% 150% at 4% 100%, rgb(237 124 50 / 22%), transparent 62%), radial-gradient(70% 150% at 96% 0%, rgb(25 59 90 / 18%), transparent 62%), linear-gradient(135deg, rgb(255 255 255 / 52%), rgb(255 255 255 / 30%) 48%, rgb(255 255 255 / 46%)), rgb(255 255 255 / 20%)"
  nav-rim: "linear-gradient(90deg, rgb(237 124 50 / 95%), rgb(246 168 116 / 90%) 26%, rgb(255 255 255 / 85%) 50%, rgb(110 142 180 / 90%) 74%, rgb(25 59 90 / 95%))"
  nav-blob: "radial-gradient(90% 70% at 30% 6%, rgb(255 255 255 / 92%), rgb(255 255 255 / 0%) 62%), linear-gradient(135deg, rgb(237 124 50 / 30%), rgb(255 255 255 / 34%) 50%, rgb(25 59 90 / 24%))"
  nav-border: "rgb(25 59 90 / 12%)"
  ink: "#171717"
  muted: "#646464"
  canvas: "#ffffff"
  surface: "#f5f5f5"
  paper: "#ffffff"
  border: "#ebebeb"
  control-border: "#797979"
  secondary-border: "#8b949c"
  selected: "#eaf0f5"
  disabled: "#e7e7e7"
  danger: "#a50c25"
  danger-surface: "#fff1f2"
  warning: "#745b00"
  warning-surface: "#fff7df"
  success: "#007004"
  stock-surface: "#edf7ed"
  stock-action: "#ffffff"
  stock-hover: "#eaf0f5"
  scrim: "rgb(0 0 0 / 24%)"
rounded:
  control-radius: "12px"
  card-radius: "16px"
  photo-radius: "16px"
  pill-radius: "9999px"
  dock-radius: "9999px"
runtime:
  font: '"Plus Jakarta Sans", "Anuphan", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
  label-font: 'var(--ds-font)'
  brand-font: '"Rammetto One", sans-serif'
  body-size: "18px"
  body-line: "28px"
  label-size: "16px"
  label-line: "24px"
  caption-size: "14px"
  caption-line: "22px"
  control-height: "52px"
  chip-height: "48px"
  space-xs: "4px"
  space-sm: "8px"
  space-md: "12px"
  space-base: "16px"
  space-lg: "24px"
  space-xl: "32px"
  shadow-hover: "0 4px 12px rgb(0 0 0 / 8%)"
  content-width: "1120px"
  reading-width: "760px"
  work-width: "960px"
  panel-space: "32px"
  amount-size: "32px"
  amount-line: "40px"
  dock-width: "620px"
  dock-blur: "36px"
  dock-saturation: "1.7"
  dock-inset: "16px"
  dock-shadow: "inset 0 2px 3px rgb(255 255 255 / 85%), inset 0 -10px 18px rgb(25 59 90 / 8%), 0 14px 34px -6px rgb(25 59 90 / 20%), -22px 14px 34px -18px rgb(237 124 50 / 34%), 22px 14px 34px -18px rgb(25 59 90 / 30%)"
motion:
  feedback: "125ms"
  selection: "160ms"
  content: "220ms"
  disclosure: "240ms"
  dialog: "280ms"
  loading-delay: "225ms"
  ease: "cubic-bezier(.24, 1, .4, 1)"
receipt:
  ink: "#193b5a"
  paper: "#ffffff"
  selected: "#eaf0f5"
  danger: "#b42318"
  font: '"Plus Jakarta Sans", "IBM Plex Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif'
---

# Design System: Khonnai · คนใน

## Direction and authority

Approved whole-app Fastwork redesign,17 October2026: white workspace, navy/orange brand, neutral grouping, soft geometry and purposeful task feedback. PRODUCT.md and UX-CONTRACT.md retain product truth and behavior. The representative preview in outputs/fastwork-preview was approved in chat. The user subsequently authorized a public landing at `/landing` and `/landing/`; `/` retains the operational app. Preserve docs/research/fastwork/landing-reference.md as source evidence, with implementation details in docs/research/landing-implementation.md.

Follow-up user decisions: Iconly SVG icons; Rammetto One for the English wordmark; **navy→orange gradient from left to right**. Scope the gradient to the wordmark, never amounts/headings/body. Keep the existing mascot and Thai คนใน in readable UI type. Receipt shop identity stays unchanged.

Premium refinement,17 October2026: user requested qualities associated with Apple/Mercedes. Preserve this Fastwork visual world and brand; refine precision, hierarchy, considered content widths and tactile feedback. This is an operational app: an immediately readable total, aligned controls and calm surfaces carry premium quality. Rammetto remains the friendly brand signature; no new display font in operational UI. Research and landing implications: docs/research/premium-direction.md.

## Canonical token path

The scalar frontmatter blocks colors/rounded/runtime/motion/receipt above are canonical. `npm run theme:build` generates src/styles/tokens.css; `npm run theme:check` detects drift. Never hand-edit generated CSS. Stable --ds-* variables feed shared components. No DTCG migration or second app theme. The receipt block emits independent --receipt-* variables so app color/font changes cannot alter the approved paper/PNG. Baseline fixture and PNG are in outputs/fastwork-preview/.

## Typography and layout

Self-host Anuphan variable100–700 for Thai application text, Plus Jakarta Sans400/500/700 for Latin, and Rammetto One regular only for the wordmark, with OFL notices retained. User requested a premium Thai-font recommendation and continuation on17 October2026; Anuphan is the recommended first implementation, with IBM Plex Sans Thai and Noto Sans Thai recorded as alternatives. Body18/28, label16/24, caption14/22; headings28/36 mobile and32/40 desktop weight500; no Thai tracking; tabular figures for quantities. IBM Plex Sans Thai Looped400/500/600/700 stays available as fallback and is retained in the frozen receipt family; **do not replace receipt.font with the app font**.

19 October 2026: user approved Quiet Gallery with photo and code as equal recognition cues, and Floating Dock on desktop/mobile. Mobile has16–20px content padding and2 gallery columns; from601px the gallery has3 columns, maximum1120px. Each photo and complete code footer form one button, with a quiet directional icon. Keep no-photo tiles useful; synthetic concept photographs never seed a real shop. Detail retains explicit size selection before color/mixed-pack cards. Desktop separates identity and variant workspace; mobile stacks them. Secondary screens retain BackButton, search/focus restoration and unsaved guards.

One glass bottom dock owns the same five labeled destinations on every viewport; no desktop sidebar. Match concept C with a full capsule silhouette, at most620px wide, inset16px desktop/8px narrow mobile plus safe area, blur36px, saturation1.7 and brightness1.04. Desktop uses64px menu targets with equal8px padding on every side, so the selected blob sits evenly inside the capsule even on the first and last item; phones use72px targets with6px padding, growing for wrapped Thai labels. Solid white is the fallback; supported browsers get liquid glass: a translucent white fill washed with brand orange at the left and navy at the right, a 1.5px orange-to-navy rim, a specular highlight along the top edge and inset light-catching edges. The fill is deliberately dense enough that content scrolling behind never reads as legible text, even where a browser skips the blur. Opaque ink menu icons and labels stay crisp over the translucent surface; the selected item keeps navy text on a full-capsule liquid-glass blob with the same orange-to-navy rim. The blob slides to the chosen item with a springy overshoot and swells while pressed; reduced motion removes the movement, and forced-colors mode swaps the glass for a Highlight outline. A soft navy elevation and faint orange/navy edge shadows echo the concept. Nav labels remain at least14px and targets at least48px. Content and scroll clearance include the dock height, safe area and gap so final actions/errors are reachable. Brand and data context move to the topbar on every viewport. Keep glass scoped to navigation; all forms and amounts use opaque surfaces.

The narrow English dock retains the incumbent full-word labels Products / Bills / Reserve / Returns / Settings; accessible names retain Reservations and Returns / exchange. These are deliberate compact navigation variants, with complete destination headings on each page. Keep English dock labels on one line at320px without reducing14px type. Gallery announces the filtered product-code count, never combined stock quantities.

## Components and surfaces

White base/cards, #f5f5f5 grouping/image placeholders, subtle dividers, stronger input borders. Control radius12, card/photo16, capsule CTA and size chips. Controls52px, size chips48px. Navy save, orange add/dark ink, white secondary. Green is semantic availability; stock actions navy/neutral. Danger actions retain confirmations and labels.

Premium refinement uses500-weight headings and field labels, body18/28 unchanged. White secondary buttons keep the semantic navy label with a quieter border; hover/press/focus provide coherent feedback. Base panels use a single fine boundary, never a border plus decorative elevation. The bill summary is a solid neutral inset without a border; total is32/40, before its full-width save action. Receipt pixels remain independent. Content maximum1120; settings prose760; return/reservation forms960. Panel padding32 desktop/20 mobile. Mobile navigation icons share a baseline even when Thai labels wrap; no shortened menu labels or smaller-than14px type. Entry content stays visible throughout its short transition.

Forms preserve field/DOM order and native OS select/file controls. Hints/suffixes carry units. Failed validation/commands focus the existing local error, retain inputs and permit retry. Bill total and submit remain before full paper preview. The paper pixels keep their dedicated frozen theme; surrounding controls/captions use the new UI.

## Motion and resilience

Feedback125ms, selection160ms, content220ms at most6px travel, disclosure240ms, dialog280ms. View/tab changes carry motion, not every nested card. Loading indicator waits225ms only while pending; duplicate-submit protection starts immediately. Never count-up stock/money or commit at animationend. Reduced motion keeps final content immediately visible, no movement/loops. Preserve forced-colors, keyboard focus and scrollbar visibility.

## Verification

Check token drift, typecheck/lint/unit/build/browser,320/390/768/1440, zoom200%, keyboard/focus, native dropdowns, long Thai text, empty/error/disabled/saving and reduced motion. Compare fixed receipt PNG bytes against pre-redesign baseline. SKIPPED/missing browser is unverified. Keep schema, localStorage, domain commands and all business transitions unchanged.

### Settings and language

Settings uses quiet white icon rows grouped into Your shop, Preferences, and Data/history. Rows open separate task pages with a labeled back arrow; no decorative search or unsupported account settings. Reuse original Iconly Light SVGs and runtime tokens. Thai uses Anuphan, Latin remains Plus Jakarta Sans. UI language is Thai/English; source shop text and receipt typography are preserved.

### Public landing

18 October 2026: implement approved prototype D as a separate static marketing surface at `/landing/` (Thai) and `/en/landing/` (English). The root `/` redirects to `/landing/` and the operational app opens at `/app`; shop schemas, commands, preferences, paper bills and PNG stay unchanged. Marketing source lives in `landing/`, localized copy in `src/landing/content.ts`, shared brand keyword motion in `src/landing/keyword.css`, and its builder in `scripts/build-landing.mjs`. See docs/research/landing-implementation.md for current verification and SEO boundaries.

The white/navy/orange Fastwork world remains authoritative. Preserve the photo scroll hero, 32px glass navbar blur, one guided sale example, preparation card carousel, future pricing and FAQ. New marketing text, including the wordmark, uses self-hosted Noto Sans and Noto Sans Thai, per the user's explicit request for Noto throughout this page. Operational and receipt font tokens above do not change. Generated `src/styles/tokens.css` is copied into the landing build; the landing stylesheet owns marketing layout and font overrides only.

The hero headline is 600 weight, up to100px desktop and58px mobile. The hero photos illustrate clothing and underwear SMBs; AI provenance is explicit. Actual app captures remain in the separate guided demo and use clearly labeled synthetic stock and sales data.

The user explicitly approved gradient motion in three heading keywords: ด้วยตัวเอง, ลองกับร้านคุณ, งานของร้านคุณ; English equivalents carry the same treatment. Their navy-to-orange highlight travels left to right at a constant speed,3.6s per seamless loop, with no dwell frames. Keyword phrases stay together on one line. These approved highlights and the existing brand gradient are scoped exceptions to the general no-gradient-heading rule. Offscreen/hidden-page work pauses; reduced motion and forced colors expose readable static text. At narrow zoom widths, headings scale to keep the complete phrase visible.

Use short, literal language for shop owners: backup file, current phone/computer, quantity left. Do not expose JSON, localStorage, browser or PNG terminology in marketing copy. Explain that data stays on the current device and backups are manual. Price tiers are future plans, not current fees, quotas or payment functionality. No adoption claims, fake customer logos or testimonials.

The build emits complete localized HTML, canonical/hreflang links, descriptive page metadata, social images, truthful WebPage/SoftwareApplication structured data and a two-page sitemap. Language selection navigates between real localized URLs. Landing demonstration state never reads shop records. Native FAQ/details, language select and keyboard carousel controls remain available.
