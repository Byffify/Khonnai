# Produce and verify Hero concept
Status: done
Blocked by: none

## Acceptance
- Original hand/phone geometry and screen masking remain intact.
- Six-second silent MP4 + WebM, final PNG poster, responsive standalone hero.
- Real mobile app capture, synthetic data, existing logo/fonts/copy.
- 320/390/768/1440px and 200% zoom; reduced motion, no-JS, media failure and replay checks.
- Inspect decoded video frames, not just compositor images.

## Comments
- 19 October 2026: user approved implementation. Preparing PSD reader and encoder; production files remain untouched.
- Delivered the separate Hero, silent six-second1280×1280/30fps MP4/WebM, PNG/WebP final poster, source compositor and preview server.
- `node .scratch/hero-phone-concept/verify.mjs`: passed320/390/768/1440 at100%/200% CSS zoom; no JS; reduced-motion no-download and runtime switch; failed-media poster/CTA; keyboard replay; pause/resume; both video formats independently decoded. Report: `outputs/hero-phone-concept/verification/report.json`.
- Fresh review identified combined intersection/tab-visibility resume loss. `verify-visibility.mjs` reproduced a timeout before the fix and passed afterward, including explicit user pause preservation. Final artifact verification passed again after the fix and final video render.
- FFmpeg full decode of both final files: exit0 with no errors. Inspected decoded opening/transition/final checkpoints and browser desktop/mobile captures.
- No production integration/deployment or physical iPhone/Safari claim. Existing project build/test suite not rerun for the isolated artifact.
