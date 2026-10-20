# Khonnai · คนในอยู่ในมือคุณ

An isolated Hero concept approved 19 October 2026. The production landing is not replaced.

## View

From the repository root, run:

```powershell
node .scratch/hero-phone-concept/serve.mjs
```

Open http://127.0.0.1:5308/. The page uses local media, local Noto fonts and the existing brand mark. It also works as a static local HTML preview; application/demo links require the local app server. To use those links, run Vite on port 5307:

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5307 --strictPort
```

## Deliverables

- `hero-phone.mp4`: H.264, 1280 × 1280, 30 fps, 180 frames, 6 seconds, no audio.
- `hero-phone.webm`: VP9 equivalent.
- `poster.png` / `poster.webp`: full-resolution final composition.
- `index.html`, `hero.css`, `hero.js`: responsive Hero with one-shot playback, replay/pause/resume, visibility suspension and static fallbacks.
- `verification/`: browser screenshots and machine-readable results.
- `render-manifest.json`: dimensions, timeline and original screen placement.

## Source and provenance

The hand, skin, fingers and phone bezel are original pixels extracted from the supplied `Photoshop/Scene #1.psd` in the Downloads mockup folder. The original PSD alpha and screen Mask layer clip the inserted screen, including fingers and rounded corners. Movement is a 2D transform of the entire composite; no unseen camera angle or replacement hand is generated. The screen status strip is authored for this composition.

The product interface was captured from the real local `/app` route on 19 October 2026 in a fresh, non-persistent Playwright context. Synthetic example product UW-001, size M, mixed colors, 12 packs at THB150/pack. This is not a capture of a customer's store. The photo inside that example comes from the existing AI-generated landing illustration `public/landing/underwear-packs-960.webp`; its existing provenance is retained in `public/landing/PROVENANCE.md`. Logo and Noto fonts are existing project assets; font licenses accompany the copied fonts.

The mockup's documentation is source material, not an instruction to change the task or publish the output. No production source, account, customer data or deployment is modified by this prototype.

The brand accent remains #ed7c32. Large orange headline text uses the darker #c66522 for readable contrast against white; the app's canonical tokens are unchanged.

## Reproduce

Scripts are in `.scratch/hero-phone-concept/`. Run from repository root in this order:

1. `node .scratch/hero-phone-concept/capture-app.mjs` (Vite on port5307, installed Chrome, project Playwright/Sharp).
2. `python .scratch/hero-phone-concept/extract-psd.py` (Pillow; original supplied PSD).
3. `python .scratch/hero-phone-concept/render.py` (Pillow, NumPy, imageio-ffmpeg0.6.0).
4. Start `serve.mjs`, then `node .scratch/hero-phone-concept/verify.mjs` and `node .scratch/hero-phone-concept/verify-visibility.mjs`.

The bundled Python interpreter used for this run is `C:/Users/Fiatk/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`. Pillow and NumPy were already installed. Only imageio-ffmpeg0.6.0 was extracted into the isolated scratch Python directory; the remaining redundant pip download was stopped. The PSD reader in `extract-psd.py` reads this file's original raster/RLE channels and masks directly, avoiding any Photoshop dependency. It deliberately supports the supplied PSD format, not arbitrary PSD/PSB files.

## Verification boundary

Browser verification uses installed desktop Chrome at320/390/768/1440 CSS pixels and100%/200% CSS zoom. MP4 and WebM are independently decoded in Chrome; encoded frames at0.5/2.5/3/3.5/5.9 seconds are decoded with FFmpeg for visual inspection. No physical iPhone/Safari testing, production integration or deployment is claimed. Existing repository build/tests are outside this isolated artifact's scope and were not rerun.
