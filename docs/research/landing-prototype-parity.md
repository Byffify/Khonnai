# Landing: comparison with approved prototype D

18 October 2026. Compared the rendered prototype at port5288 with the production build at port5291 on1440px desktop and390px mobile, from hero through footer. Captures/measurements: `outputs/landing-parity/after/`. The original before-cleanup prototype is retained locally as `.scratch/landing-v2-prototypes/d-parity-reference.html`.

## Corrections

| Area | Result |
|---|---|
| Hero | Same shop/product/underwear imagery and source-based ReactLenis/Motion scene. Restored the750ms headline reveal. The requested larger headline remains100px desktop and scales on mobile. |
| Navbar | Restored984px desktop /358px at390px mobile,68px measured height and32px glass blur. Language selector and Noto wordmark remain intentional changes. |
| Moving capability strip | Restored the original seven Iconly SVGs, open icon/text treatment,34s horizontal loop, greyscale hover behavior and edge fade. Removed the unintended bordered capsule treatment. |
| Shop-fit and sale demonstration | Restored prototype section proportions, desktop columns/gaps, sticky offsets and heading weights. Restored the preceding cards fading/scaling as the next step is reached; reduced motion keeps all final content visible. |
| Optional size/color example | Removed as requested, including its script/state and query-parameter preservation. The primary four-step sale demonstration remains. |
| Preparation carousel | Restored420px desktop /380px mobile card minimum height. Removed the visible helper line and bottom1/3 counter; position remains available to screen readers. Keyboard/arrow navigation remains. |
| Pricing | Reduced switch from72.2px to54px; buttons retain44px targets. Width310px matches prototype. Numeric price transition and fast-switch handling remain. |
| FAQ | Restored prototype desktop proportions and spacing. Wording and question set retain the approved plain-language revision. |
| Closing | Removed the prototype label; background is light peach `#fff0e4` in both versions, matching the original prototype and the user’s explicit correction. Restored prototype heading/image/spacing scale. |

The requested sale-introduction/disclaimer paragraphs and preparation footer text are removed in both languages. The prototype has also been cleaned up so its preview does not show the obsolete prototype label or optional example. The original light-peach closing background is preserved.

## Deliberate differences

This is not a pixel-identical copy: production uses the requested Noto Sans/Noto Sans Thai, English localization, simpler text, real localized URLs, optimized images and search metadata. These change text widths/line breaks and some content heights. The preparation arrows allow room for the longer localized copy. Sample data and AI imagery retain descriptive alt text/provenance without the deleted visible helper paragraphs. Shop data, application workflows and paper/PNG output were not changed.

## Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed, including TypeScript.
- `npm.cmd run test:browser -- --grep landing`:5/5 passed. This verifies removal of the requested elements, both languages,320/390/768/1440px,54px switch/44px targets,200% zoom, keyboard, reduced motion, price switching, localized static HTML/SEO, storage isolation and navigation into the unchanged app.
- Rendered comparison reports no page errors on either version at1440px and390px. Captured every section on both versions; measured navbar width, switch height and card height match the prototype at both widths.
- The prior full32-test app/landing regression is documented separately. It was not rerun for this presentation-only follow-up. No deployment was performed.

Peach correction verified: production build passed; live prototype, Thai and English closing sections all compute to rgb(255, 240, 228) at 1440px and 390px. Screenshots and measurements: outputs/landing-parity/peach-correction/.
