# Khonnai: premium refinement and landing direction

17 October2026. User requested Impeccable refinement inspired by Apple/Mercedes, then a premium Thai font recommendation and continuation. The current application remains an operational tool for Thai shop owners; the landing page is deferred.

## What the references show

- [Apple homepage](https://www.apple.com/): a clear product focus, short headline, restrained CTA grouping and substantial product imagery. Inspected the rendered homepage and its navigation. The transferable principle is hierarchy: give the important object room and subordinate surrounding controls.
- [Mercedes-Benz homepage](https://www.mercedes-benz.com/en/): deliberate emblem placement, editorial heading/imagery and generous separation of brand/story/navigation. Inspected the rendered page and dismissed its cookie overlay to read the content. The transferable principle is consistency and considered composition, while its dark campaign palette belongs to that brand surface.

These are design interpretations from the observed pages, not proof that one visual treatment causes perceived luxury or higher sales. No official Apple/Mercedes token values or measured animation durations are claimed. Existing Khonnai/Fastwork motion remains the implementation contract. Their product imagery, logos and marketing copy were not imported into Khonnai.

## What changed in the app

Preserve white, orange #ed7c32, navy #193b5a, Iconly and the user-selected Rammetto One navy-to-orange wordmark. Premium quality is expressed through accurate hierarchy and calm operational details:

- 500-weight headings/labels,18/28 body, consistent alignment and52px controls; Thai text now uses self-hosted Anuphan after the user's font follow-up.
- Content maximum1120px; settings760px; return/reservation entry960px. Desktop panel padding32px/mobile20px. Related controls remain grouped and field order is unchanged.
- Bill total32/40 in a neutral summary; its save CTA fills that summary's width. The total/submit still precede paper preview in DOM order. Removed the preview's outer rounded panel, preserving every pixel of the paper renderer.
- Fine panel boundaries, softer secondary-action border and consistent hover/press feedback. Default control boundaries remain visible; invalid red borders survive hover.
- Mobile menu icons align even when the original Thai labels wrap; all buttons remain80px high in the captured390px view, compared with90px before. No relabeling or font reduction below14px.
- Entry content remains opaque throughout a4px transition. Reduced motion shows final state immediately. Stock/money never count up and persistence does not depend on animation.

Runtime values are generated from DESIGN.md through scripts/build-theme.mjs. Anuphan is app-only: the receipt keeps the original IBM Plex Sans Thai Looped/Plus Jakarta family and dedicated receipt tokens. Domain/storage and all workflow contracts remain unchanged.

## Thai font recommendation

The descriptions below are design judgments for this brief, not objective rankings.

| Font | Character | Khonnai role |
|---|---|---|
| **Anuphan** | Clean contemporary Thai sans, restrained and approachable | Recommended and applied to Thai app text |
| IBM Plex Sans Thai | More distinct, structured letterforms | Alternative if a stronger editorial/technical voice is preferred |
| Noto Sans Thai | Neutral and familiar | Alternative prioritizing a quiet, conventional voice |

All three repositories ship SIL OFL1.1. Commercial embedding/bundling is permitted with the copyright/license retained; selling the font alone is excluded. Sources: [Anuphan OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/anuphan/OFL.txt), [IBM Plex Sans Thai OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsansthai/OFL.txt), [Noto Sans Thai OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/notosansthai/OFL.txt).

Applied asset: public/fonts/Anuphan-Variable.ttf, downloaded from the [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/anuphan), with public/fonts/Anuphan-OFL.txt. [Metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/anuphan/METADATA.pb) records Cadson Demak and weight axis100–700. Font SHA256:7ec47ebcaa9d6459d974691cbb42fae52e1449478a607b071bfaf3ccdb433ce4. Self-hosted; no Google Fonts CDN dependency. Rammetto wordmark and receipt font remain separate.

## Landing page next

Keep the same brand, type roles, neutral surfaces and CTA language. Make the first composition lead with a clear shop problem and a high-quality image/demo of the actual app. Show the existing photo/code→size→color workflow and sale→remaining stock behavior. Explain benefits with real evidence; use only verified customer counts, quotes or performance claims. State local-device storage and backup limitations naturally near the relevant feature.

Suggested sequence: concrete shop problem → actual app demonstration → three existing task benefits → how it works → relevant evidence/limitations → one clear CTA. Landing can use larger imagery and more expressive scroll transitions than the working app; retain reduced motion. Existing Fastwork landing/motion research remains in docs/research/fastwork/. No landing implementation is included in this pass. Real product photography and crisp app demonstrations are still needed for the final marketing surface; placeholder catalog fixtures are test data.

## Verification

Before/after source screenshots and comparison viewer are in outputs/premium-refinement/. The before captures use the previous live app; after captures use the refined app with the recommended Thai font. All data is synthetic in isolated browser contexts.

The initial visual refinement passed typecheck, lint,14 unit tests, build, token drift and22 browser tests. A concurrent screenshot/build run interrupted the first receipt test with a Vite navigation (execution context destroyed), rather than a PNG mismatch. An isolated full rerun passed22/22. The Thai-font follow-up is verified separately in the task ledger after capture and tests; no interrupted run counts as a pass.

Final Thai-font verification: build(TypeScript+Vite), lint and theme:check passed;69 generated tokens match DESIGN.md. Final isolated browser suite22/22 passed, including font availability at400/500/600/700 with Thai glyphs,320/390/768/1440 layouts, long Thai text, reduced motion, CSS zoom, invalid-field hover and fixed receipt byte equality. After screenshots refreshed for Anuphan; desktop/mobile detail/settings typography inspected. Unit suite14/14 passed during the same refinement; font follow-up does not modify domain/storage code. Static evidence remains separate from these browser results.

Premium static audit:0 findings (outputs/premium-refinement/premium-audit.json). Impeccable detector reports four incumbent findings: the explicitly approved wordmark gradient/Plus Jakarta family and two radii in unimported App.css. These are recorded exceptions, not silent fixes or app runtime evidence.

Calculated token pairs: secondary border/white3.08:1; navy/neutral summary10.62:1; muted/neutral summary5.43:1; orange-action ink/orange5.06:1. These are selected sRGB pairs, not a full accessibility audit. Real-device OS controls, browser chrome zoom and screen-reader certification remain manual; browser coverage includes viewport emulation, CSS zoom, keyboard/error focus and reduced motion.
