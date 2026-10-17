# Khonnai landing structure revision

Historical capture set. The current D hero now uses the user's supplied ReactLenis/Motion source; current hero/brand checks and rebuild instructions are in outputs/landing-hero-fix/README.md. The structure decisions below remain, but these old hero screenshots are not the current implementation.

18 October2026. Current local preview: http://127.0.0.1:5288/d.html.

Research: docs/research/fastwork/pos-landing-structure-review.md. Compared Wongnai POS and Loyverse official landing pages; FoodStory redirects to Wongnai and is not counted separately. The conclusion is an information-architecture judgment, not a claim that all large-company landings follow one template.

Removed duplicate pain-note section and second sale walkthrough. Added audience fit and getting-started/data-readiness sections. Retained one primary stepwise app teaser, optional memory-only interaction, short capability navigation, proposed pricing, FAQ and closing action. No fake proof, testimonials, hardware integration or support service added.

Prior requested fixes included four distinct hero images, no manual marquee stop button, no hero replay button, real price exit/entry animation and sliding billing selector. Hover/focus/offscreen/reduced-motion stopping remains. Three shop/product photos are AI illustrations; app image is from the supplied deck.

verification.json records real local-browser checks at320/390/768/1440, four loaded hero images, removed controls/stories, actual Web Animations keyframes, rapid price switching cleanup, keyboard billing selector, carousel focus/hover stop, optional quantity selection, empty storage, no pageerror/overflow, reduced motion and33unchanged production source hashes. The video focuses on gallery and monthly/annual transitions.

No production build/regression suite, real-device, full screen-reader or performance benchmark was run. This is an isolated prototype. Pixel-exact parity with Hover is not claimed; price timing/rotation is authored to match its observed exit/entry approach.

To regenerate current D from repo root, run in order:

```powershell
node .scratch/landing-v2-prototypes/build-motion-v2.mjs
node .scratch/landing-v2-prototypes/refine-landing-v3.mjs
```

Serve with `node .scratch/landing-v2-prototypes/server.mjs`. The unchanged app destination is Vite on5198. Capture with installed Playwright browser and permitted localhost access:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = 'C:\Users\Fiatk\AppData\Local\ms-playwright'
node .scratch/landing-v2-prototypes/capture-structure-v3.mjs
```

Two bounded visual rounds were used; the final round confirms the pricing stylesheet ordering and gallery captions. A final low-impact closing-label correction follows these captures and does not alter layout structure or behavior.
