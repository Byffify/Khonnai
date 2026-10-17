# Khonnai Motion Prototype D

Historical capture set. Current D was revised after user feedback; see outputs/landing-structure-v3/README.md and its screenshots/verification. The visible pause/replay controls described below have been removed in the current prototype.

Open http://127.0.0.1:5288/d.html. Comparison at http://127.0.0.1:5288/index.html preserves A/B and links latest D.

Hero, seven-capability carousel, four-step scroll teaser, optional size/color mini demo, sale highlight replay, proposed pricing and FAQ are included. The main application is not embedded. App source and receipt renderer remain unchanged.

Source rationale and slide decisions: docs/research/fastwork/hover-slides-motion-prototype.md. Browser outcomes: verification.json. Screenshots use requested actual1440×1000 and390×844viewports, full-page captures are additional files. motion-tour.webm records the desktop walkthrough.

Pricing is explicitly a future proposal, not current billing. Annual proposals are totals3,229.20/7,549.20baht per year. The generated shop photo is labeled AI illustration. App screenshots were downloaded from the supplied deck's /demo/catalog.png, stock.png, sale.png and receipt.png through browser media download and copied into scratch; these show the deck's earlier app design. They are demonstration content, not new production screenshots.

## Run again

From D:\Khonnai, run each command in a separate terminal:

```powershell
node .scratch/landing-v2-prototypes/server.mjs
```

```powershell
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5198 --strictPort
```

The second process supplies the unchanged app destination for start buttons. Only localhost is bound. To rebuild D from C plus pricing and hero/teaser composition:

```powershell
node .scratch/landing-v2-prototypes/build-motion-v2.mjs
```

Verification requires installed Playwright Chromium and local network permission:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = 'C:\Users\Fiatk\AppData\Local\ms-playwright'
node .scratch/landing-v2-prototypes/capture-motion.mjs
```

No production build/regression suite, real-device, screen-reader or performance claim is made. Browser verification covers the isolated prototype. Thai only; production localization is a later integration step.
