# Candidate B: separate public entry, product story

## Grounding

`src/main.tsx` mounts LanguageProvider and App; `/` is the working shop. `vite.config.ts` currently has one HTML entry. PRODUCT.md limits the product to browser-local inventory, bills, manually entered reservations, returns and backup. No cloud, collaboration, payment or customer evidence claims belong on this page. DESIGN.md supplies shared tokens, fonts, Iconly, brand and motion; the Fastwork landing archive supplies composition ideas, not working animation code.

## Architecture

Prefer a second Vite entry: `landing/index.html` → `src/landing/main.tsx` → LandingPage. Configure explicit app and landing HTML inputs. `/landing/` works as an actual directory document on ordinary static hosting; redirect `/landing` to `/landing/` where supported. App entry remains untouched. Landing imports tokens, font declarations, Brand and Icon, never App, repository or shop commands. CTA is a normal link to `/`.

Alternative: a pathname branch in current main dynamically imports LandingPage at `/landing` and App otherwise. This has a smaller initial diff and one build entry, but depends on SPA fallback for deep links and makes the shared bootstrap responsible for two products. The separate entry makes storage isolation visible in the import graph and gives landing its own title/description. Tradeoff: duplicated HTML metadata and explicit Vite build input; share CSS sources, not bootstrap machinery.

## Composition

Use an asymmetric editorial hero: large Thai heading left, one carefully cropped interactive product board right. Avoid orbit cards or fake metrics. White space and navy typography connect to the app; orange tags, oversized section numbers and alternating full-width compositions distinguish marketing.

Sequence: concise promise → selectable product/size/color illustration → three-step sale story → reservations and returns pair → honest local-data/backup explanation → FAQ and final CTA. Label every illustrative quantity as sample data. A compact sticky header contains brand, section anchors, language and “เปิดแอป”. Mobile stacks the board below copy, with natural scrolling rather than horizontal rails.

## Typed demonstration and locale

Caller: `<ProductStory locale={locale} />`.

`type StoryStep = 'product' | 'size' | 'color' | 'bill'`.
`type StoryEvent = { type: 'choose'; step: StoryStep } | { type: 'reset' }`.
One reducer owns selected step. A fixed demonstration fixture owns quantities; switching steps only changes presentation, never inventory. Explicit step buttons beat timers and preserve accessible state. Locale is `'th' | 'en'`, component-owned with a typed content dictionary; initial Thai, no localStorage reads or writes. Set document language through one effect.

## Motion and verification

Use DS feedback125ms/selection160ms and story panel220ms. One IntersectionObserver triggers restrained section reveals; disconnect on cleanup. Content remains visible without JS/observer. No continuous timers, blur, money count-up or animation-dependent state. Reduced motion removes transforms and shows final state immediately.

Check direct `/landing/` production load and `/` regression; record storage contents before/after every landing action. Test keyboard step selection, focus, Thai/English long copy, 320/390/768/1440px, zoom200%, reduced motion, zero overflow and CTA destination. Compare app receipt baseline unchanged.
