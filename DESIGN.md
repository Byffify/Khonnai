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

Approved whole-app Fastwork redesign,17 October2026: white workspace, navy/orange brand, neutral grouping, soft geometry and purposeful task feedback. PRODUCT.md and UX-CONTRACT.md retain product truth and behavior. The representative preview in outputs/fastwork-preview was approved in chat. Landing stays deferred; preserve docs/research/fastwork/landing-reference.md.

Follow-up user decisions: Iconly SVG icons; Rammetto One for the English wordmark; **navy→orange gradient from left to right**. Scope the gradient to the wordmark, never amounts/headings/body. Keep the existing mascot and Thai คนใน in readable UI type. Receipt shop identity stays unchanged.

Premium refinement,17 October2026: user requested qualities associated with Apple/Mercedes. Preserve this Fastwork visual world and brand; refine precision, hierarchy, considered content widths and tactile feedback. This is an operational app: an immediately readable total, aligned controls and calm surfaces carry premium quality. Rammetto remains the friendly brand signature; no new display font in operational UI. Research and landing implications: docs/research/premium-direction.md.

## Canonical token path

The scalar frontmatter blocks colors/rounded/runtime/motion/receipt above are canonical. `npm run theme:build` generates src/styles/tokens.css; `npm run theme:check` detects drift. Never hand-edit generated CSS. Stable --ds-* variables feed shared components. No DTCG migration or second app theme. The receipt block emits independent --receipt-* variables so app color/font changes cannot alter the approved paper/PNG. Baseline fixture and PNG are in outputs/fastwork-preview/.

## Typography and layout

Self-host Anuphan variable100–700 for Thai application text, Plus Jakarta Sans400/500/700 for Latin, and Rammetto One regular only for the wordmark, with OFL notices retained. User requested a premium Thai-font recommendation and continuation on17 October2026; Anuphan is the recommended first implementation, with IBM Plex Sans Thai and Noto Sans Thai recorded as alternatives. Body18/28, label16/24, caption14/22; headings28/36 mobile and32/40 desktop weight500; no Thai tracking; tabular figures for quantities. IBM Plex Sans Thai Looped400/500/600/700 stays available as fallback and is retained in the frozen receipt family; **do not replace receipt.font with the app font**.

Mobile base with16–20px content padding and safe-area bottom navigation. White240px desktop sidebar at1024px, same five labels/destinations/guards. Catalog2 columns mobile,3 at601px,4 at1151px, photo/code only. Detail shows photo/code, explicit size selection, separate white color/mixed-pack cards. Secondary screens keep BackButton, original focus/search restoration and unsaved guards.

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
