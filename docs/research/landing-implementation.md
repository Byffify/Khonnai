# Khonnai landing implementation

## Current implementation · 18 October 2026

Follow-up cleanup and comparison with prototype D: [landing-prototype-parity.md](landing-prototype-parity.md). The optional size/color example, visible sale helper/disclaimer and preparation footer/count were removed at the user's request; language switching no longer carries example-selection URL parameters. Both versions now have the original light-peach closing surface (`#fff0e4`) with no prototype label, following the user’s correction. The targeted follow-up passed5 landing browser checks; the32-test record below is the preceding full regression, not a claim that the full suite was rerun after this cleanup.

The user approved prototype D and requested implementation, plain language, Thai/English, Noto throughout the landing, stronger search foundations, a larger hero headline and continuous navy/orange heading highlights. This section supersedes the historical implementation record below.

- `/landing/` and `/en/landing/` serve complete static localized HTML. `/` remains the operational app. Existing `/landing` links also work. Vite development/preview middleware and Vercel rewrites resolve these pages without importing inventory/storage modules.
- `landing/hero.jsx` preserves the approved ReactLenis/Motion photo scene. `landing/controller.js` owns isolated demonstration selection, preparation carousel, interrupted price transitions and visibility-aware keyword/marquee playback. `landing/site.css` scopes the marketing surface. The old `src/Landing.tsx`, `src/landingCopy.ts` and `src/landing.css` were replaced rather than retained as a second landing implementation.
- `src/landing/content.ts` owns typed Thai/English content. Technical words such as JSON, localStorage, browser and PNG are absent from visible marketing copy. Device-local storage and manual backups are explained in plain language. English pages identify the app screenshots as Thai examples. Switching language preserves example selection through validated URL parameters and only writes the existing language-preference key; no shop records are read or written.
- Self-hosted Noto Sans Latin and Noto Sans Thai cover all live marketing text, including its wordmark, with OFL licenses retained. Operational fonts and receipt tokens are unchanged. Generated application tokens are copied during the marketing build; no generated token CSS was edited by hand.
- The hero headline is larger (up to100px desktop), with a600 weight. The three approved heading keyword highlights move left to right continuously at a constant speed,3.6s per loop, without dwell keyframes. Keyword phrases do not split across lines. CSS is shared between prototype and production. Offscreen/hidden-page playback pauses; reduced motion and forced colors show readable static text.
- The three preparation steps use the approved horizontal photo-card carousel, with native horizontal scrolling, arrow buttons, keyboard Left/Right/Home/End, boundary states and an announced position. Price tiers remain future proposals; there is no subscription/payment/quota implementation. Numeric values update immediately; decorative outgoing numbers are hidden from assistive technology.
- `scripts/prepare-landing-assets.mjs` creates responsive local WebP illustrations and social imagery. `public/landing/PROVENANCE.md` distinguishes AI illustrations and app captures with synthetic data. Production builds use the checked-in optimized files and do not require scratch sources.
- `scripts/build-landing.mjs` runs in `npm run dev` and `npm run build`; `npm run landing:build` rebuilds marketing alone. It produces localized titles/descriptions, canonical/hreflang/x-default links, social preview metadata, truthful WebPage/SoftwareApplication structured data, robots.txt and a two-page sitemap. It does not add fake ratings, customer proof or payable offers. The operational app is marked noindex; the localized marketing pages are indexable.

Search implementation follows [Google's localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions) and [multilingual URL guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites). Indexing, rankings, field Core Web Vitals and Search Console submission remain unverified until a public deployment and search-engine processing. No deployment was performed.

### Current verification

- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run theme:check`, `npm.cmd test`, `npm.cmd run build`: passed. Theme check confirms69 canonical tokens;18 unit tests passed.
- `npm.cmd run test:browser`:32 of32 passed. This includes all previous app workflows, frozen receipt appearance, isolated landing storage access, Thai/English navigation, keyboard controls, live price switching, and full localized content/metadata with JavaScript disabled.
- `.scratch/landing-production/verify-visual.mjs`: both languages at320/390/768/1440px,200% CSS zoom, actual Noto families, larger headline, no horizontal overflow, no keyword wrapping, linear infinite motion and left-to-right keyframes passed. Reduced motion and forced colors passed. Captures and a motion clip are in `outputs/landing-production/`.
- A narrow200% zoom regression was found in intrinsic CTA, billing-toggle and demo-grid sizing. It was fixed with wrapping controls, zero minimum grid widths and container-aware type/layout, then confirmed in the final browser and visual runs. Earlier failed runs are not reported as passing.
- Production-build smoke served both localized HTML pages at HTTP200 from Vite preview. Preview is local; khonnai.vercel.app was not changed.

## Historical implementation record · 17 October 2026

Implemented17 October2026. This page extends the existing Fastwork-based Khonnai system. The user selected a large headline with an interactive size/color stock example. It does not replace the operational application.

## Routes and ownership

`src/main.tsx` mounts the existing `LanguageProvider` around `SiteEntry`. `src/SiteEntry.tsx` recognizes `/landing` and `/landing/`, then lazily imports the landing. Other paths retain the existing App behavior, including `/`. These separate lazy chunks keep the operational storage modules from being evaluated on the landing route.

`src/Landing.tsx` owns only in-memory demo selection. Its `exampleStock` table supplies valid sizes, colors and quantities. `src/landingCopy.ts` owns Thai/English marketing copy and typed capability icons. It reads the language from the current provider, so there is no second preference writer. Changing language preserves the selected example. Neither landing module imports inventory or storage.

CTAs are native links to `/`. Section anchors target `#how-it-works`, `#features`, `#faq` and the interactive `#demo`. FAQ uses native details/summary. The language selector is a native select labeled **ภาษา / Language**. No synthetic sales or saves occur on the landing.

## Design sources and adaptation

The maintained application system is defined in `DESIGN.md`, generated `src/styles/tokens.css`, `src/index.css`, `src/Brand.tsx`, and `src/Icon.tsx`. The source archive is documented in:

- [Fastwork landing reference](fastwork/landing-reference.md): landing composition, responsive scenes and source limitations.
- [CSS and motion inventory](fastwork/css-motion-inventory.md): white surfaces, geometry, shared feedback and bounded hero timing observations.
- [Khonnai adaptation](fastwork/khonnai-adaptation.md): white theme with navy `#193b5a` and orange `#ed7c32`.
- [Iconly provenance](iconly-assets.md): existing official SVG geometry reused by the landing.

The task-level mapping is `.scratch/landing-page/source-mapping.md`. This implementation adapts selected Fastwork foundations; it is not an exact Fastwork JavaScript or visual clone. It copies no Fastwork photographs, endorsements, sales copy or customer data.

`src/landing.css` scopes presentation beneath `.landing`. It reuses runtime colors, fonts, radii and easing while allowing marketing headline scale and whitespace. The typography remains Anuphan for Thai and Plus Jakarta Sans for Latin. Rammetto One and the navy-to-orange gradient remain on the wordmark. Utility captions use at least14px/22px; the app's18px/28px body scale remains unchanged.

The hero pairs its headline with an interactive navy workbench. Process steps explain the actual sequence of finding a product, choosing its variant and reviewing a transaction. Wider editorial sections explain bills, reservations, returns, activity history and manual backups. The composition does not add dashboards, unsupported accounts or cloud features.

## Example data and claims

The stock example is deliberately small:

| Variant | Before sale | Example sold | After sale |
| --- | ---: | ---: | ---: |
| M / black |24|2|22|
| M / white |18|2|16|
| L / black |16|2|14|
| L / white |12|2|10|

The selected color stays selected when size changes because each example size supports both colors. All numbers update immediately. This presentation choice does not change the operational catalog's deliberate size-selection flow.

The bill illustration uses a labeled hypothetical price of฿120 per pack and a2-pack total of฿240. It is not the operational paper receipt and does not invoke its renderer. Copy explicitly states that shop records live in the current browser and that JSON backup/restore is manual. There are no adoption figures, testimonials, pricing plans, automatic synchronization or login claims.

## Motion and accessibility

The hero has one bounded entrance:600ms for copy and700ms for the workbench, using `--ds-motion-ease`. Shared controls use the established125ms feedback and160ms selection timings. The example result has a220ms presentation transition; arithmetic updates before the transition. No state operation waits for animation completion.

There are no infinite loops, scroll handlers, observers or animation timers. Reduced motion removes movement and exposes the final content. Existing focus-visible styling remains available, selected choices expose `aria-pressed`, the equation has a live region, and its result has a localized accessible name. Narrow layouts wrap navigation and stack the equation below280px of CSS layout width to support200% zoom.

## Verification record

The root worker ran these checks for the integrated change:

- `npm.cmd run theme:check`:69 generated tokens match their source.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd test`:18 unit tests passed.
- `npm.cmd run build`: passed.
- Premium strict source audit:0 findings.
- Impeccable detector:4 incumbent exceptions reviewed:2 radii in unimported `App.css`, the approved Plus Jakarta Sans family and the approved gradient wordmark.

The added live browser tests cover the three landing behaviors: isolated shop storage access, bilingual/responsive/reduced-motion/FAQ interactions, and CTA navigation with browser Back. The storage test instruments the actual browser `Storage` methods and confirms no reads or writes of `micro-erp-v1`, even when that key contains damaged data.

The final complete browser run passed30 of30 tests, including all3 landing tests and the existing stock, bill, reservation, return, recovery and settings workflows. The frozen receipt PNG comparison also passed. An earlier complete run had one cross-tab draft timeout; that case passed3 isolated reruns and the final complete run. An existing font check now waits for the real Products view to mount before awaiting `document.fonts.ready`, and the desktop empty-state capture waits for actual empty UI rather than the lazy-entry fallback.

Screenshots in `outputs/landing-page/` show Thai and English at390px and1440px, hero crops, and an English200% zoom capture. They are browser captures of illustrative data. No new raster assets ship in the landing; screenshots are QA outputs. The reused mascot's source and generation history remain in `public/brand/PROVENANCE.md`.

The implementation does not establish production hosting, indexing, SEO performance, physical-device behavior or measured animation frame rate. Direct production landing URLs require an SPA fallback to `index.html`. No deployment was requested or performed.

## Decisions shaped by Poteto Mode

**Model the Domain:** one variant table owns the demonstration quantities, and one selection value owns size/color. There is no second stock source to keep synchronized.

**Experience First:** the visitor can try the product idea directly, use real section links and open native FAQ answers. Unsupported marketing features were left out.

**Prove It Works:** storage instrumentation and the running-browser tests check the real landing, rather than treating compilation or a static screenshot as proof of isolation.

The configured Cursor model defaults were unavailable in this runtime. Delegated work used the available inherited model; this is parallel implementation and review, not a claim of independent multi-model review.

Local production-build smoke passed: preview HTTP200 at /landing; selecting L/white shows remaining10; the primary CTA opens the existing Products view at /. Preview served on http://127.0.0.1:4173/landing. The first preview attempt used an isolated sandbox listener inaccessible to the browser; restarting the preview in the browser-accessible execution environment resolved that connection issue.

## Entry URL update — 18 October 2026

The user requested landing-first entry from the Vercel domain. `/` now redirects temporarily (307) to `/landing/`; marketing CTAs open the existing app at `/app` (also available at `/app/`). Vercel rewrites the app URL to the existing root index document. Vite dev and preview mirror these routes. Existing local data stays on the same origin and retains its keys/schema. This supersedes earlier statements that the operational app opens at `/`. Deployment is a separate step.

Entry routing validation: npm.cmd run build and npm.cmd run lint passed; browser regression passed 33/33 after updating operational test entry URLs to /app. Local production preview confirmed root307, CTA to /app and direct app reload. Follow-up removed visible preparation-card step labels in Thai/English/prototype; live checks confirmed three cards and working next controls, and build passed again. These changes have not been deployed to Vercel.
