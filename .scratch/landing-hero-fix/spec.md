# Source-based Hero and overlap fix

Status: done

The user supplied ReactLenis/Motion SmoothScrollHero source. Use actual source machinery with local Khonnai imagery and own text after the imagery. First frame has no headline. Keep white/navy/orange Fastwork foundation, glass navbar, borders on every pricing card, production app unchanged.

Reproduction: atscroll900px the old absolute caption660.375–727.469 intersects sme-shop.png. Root cause is absolute caption placed inside a container whose sticky visual image remains active at the same position. Replace with normal-flow disclosure/message after the image scene.

Dependencies live only under .scratch/landing-v2-prototypes/hero-runtime. No root package/schema/storage changes.

## Verification targets

Initial source mask25/75, expansion0/100at1500, zoom170→100over2000, fade1500→2000, four parallax images with source offsets, heading fade48px/750ms after hero, Lenislerp.05, reducedmotionstaticpath. Sample scroll stages desktop/mobile; no caption/image intersections, no visual overflow, allpriceborders, backdropblur present. Keep existing pricing/teaser interaction checks.

## Comments

Repro fails before the fix at900px and passes source-based verification after replacement. Actual ReactLenis/Motion installed only in hero-runtime, bundled through isolated Vite library config, no root package changes. Browser1440/390/320/768, source key checkpoints, normal/reduced motion, glass nav and pricing all pass. Evidence outputs/landing-hero-fix. First visual batch inspected initial frame, intermediate parallax and pricing; no further UI changes after passing checks.
