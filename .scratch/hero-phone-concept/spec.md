# Hero: คนในอยู่ในมือคุณ

Approved in chat, 19 October 2026. Deliver a separate responsive hero prototype, a six-second silent MP4/WebM, and final-frame poster. Preserve the supplied hand-held iPhone PSD, move the scene in 2D, and transition its screen from the existing Khonnai logo to a fresh capture of the real mobile product interface with synthetic data. Desktop copy left/media right; mobile copy first/media below. Play once, freeze on the final frame, offer replay, and use the final poster for no-JS, playback failure and reduced motion. Existing landing and operational sources remain untouched.

Timeline: enter 0–1s; gentle tilt/scale 1–2.5s; logo-to-app transition 2.5–3.5s; settle 3.5–4.5s; hold 4.5–6s. White/navy/orange, existing Noto, existing headline/intro/CTA wording.

## Execution ledger
- Artifact-only work is isolated in new `.scratch/hero-phone-concept/` and `outputs/hero-phone-concept/` directories on the existing non-main branch. No production edits, branch switching, shared dependency manifest changes or deployment.
- Dependencies install only to this scratch directory. The sandbox cannot resolve PyPI or reach Chrome's localhost; the authorized dependency install and local browser checks run outside that sandbox.
- Capture uses a fresh non-persistent browser context with a synthetic store. No existing browser profile or live account is used.
