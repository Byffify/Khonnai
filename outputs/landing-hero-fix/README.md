# Source-based Khonnai Hero

18October2026. Current preview http://127.0.0.1:5288/d.html starts with imagery only. The supplied ReactLenis/Motion source is implemented in `.scratch/landing-v2-prototypes/hero-runtime/hero.jsx`, with images/content changed to Khonnai and a white brand surface.

## Reproduction and root cause

Old caption was absolutely positioned inside the sticky image container. Its normal-flow footprint did not reserve space while the image remained visually sticky. The direct browser repro recorded:

```text
FAIL caption overlaps image: {"scrollY":900,"caption":{"top":660.375,"bottom":727.46875},"image":"sme-shop.png"}
```

The source-based scene now owns its full scroll height, while disclosure and heading are separate normal-flow elements after it. No z-index patch or hidden caption is used to mask an overlap.

## Source behavior and brand adaptation

- Actual ReactLenis withlerp0.05 and Motion React hooks, installed only in the isolated hero-runtime folder.
- Hero1500px+100vh. Sticky full-viewport background. Source polygon25/75→0/100 over1500px, backgroundSize170%→100% over2000px, opacity1→0 over1500–2000px.
- Four source-style parallax offsets, last-quarter opacity/scale behavior. Heights are bounded to the available section; mobile horizontal offsets are adapted to the available width.
- Own heading follows the images with source y48/opacity0→final,750ms easeInOut reveal. It is absent from the initial viewport.
- White replaces the source's dark background. Photos are the existing AI shop/product illustrations and deck screenshots. Nav remains existing brand/logo/links with translucent white blur24px/saturation145%. Pricing all has visible borders and white surfaces; middle card emphasizes navy without hard bottom shadow.
- Reduced motion renders a static gallery and immediate heading; no Lenis instance is mounted in that mode.

This preserves the supplied source's mechanics. Identical pixels are not claimed because images, colors, content, mobile widths and image heights differ intentionally.

## Verification

Built only the isolated runtime bundle with `node .scratch/landing-v2-prototypes/build-hero-runtime.mjs`.

Ran `verify-source-hero.mjs` against actual localhost at1440/390/320/768. It checks initial mask/zoom and below-fold headline, seven scroll positions including the old900pxregion, no visible-image/disclosure intersections, source masks and fade checkpoints, allpriceborders/whitebackgrounds/nohardshadow, computed glass blur, price switching, optional demo result, no pageerror/pageoverflow, empty browser storage, static reduced-motion gallery and33unchanged production src hashes. Root package.json/package-lock.json remain unchanged.

```text
PASS source hero, no caption/image overlap, all pricing borders, glass nav, reduced motion, unchanged app source
```

See verification.json, initial/scroll/pricing PNGs and source-hero-motion.webm. No production build/regression suite, real-device, screen-reader or performance benchmark was run. The prototype dependencies/build are separate from the application dependency graph.

## Rebuild and serve

From D:\Khonnai:

```powershell
node .scratch/landing-v2-prototypes/build-latest-prototype.mjs
node .scratch/landing-v2-prototypes/server.mjs
```

The first command regenerates all prototype stages then bundles/injects the source hero. The server binds5288. App start links use the unchanged Vite app on5198. Restart the preview server after changing its MIME map.
