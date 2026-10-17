# Khonnai landing implementation

Use approved prototype D, including the SME photo scroll hero, glass navbar, capability strip, one guided demo, preparation card carousel, proposed pricing, FAQ and closing action. Preserve the app at `/`, shop storage and receipt/PNG rendering.

The landing at `/landing/` (Thai) and `/en/landing/` (English) uses self-hosted Noto Sans + Noto Sans Thai throughout, including its wordmark. This typography change is scoped to the landing. Simplify copy for shop owners without technical knowledge: backup file, current device, open Khonnai. No JSON/browser/localStorage/PNG jargon in marketing copy. Keep actual limitations in plain language and proposed prices clearly marked.

Render complete localized HTML at build time, not just an empty app shell. Supply canonical/hreflang, titles/descriptions, social previews, truthful structured data, sitemap and robots. Optimize imagery and fonts. Preserve reference motion with cleanup, reduced motion, keyboard controls and responsive layouts. SEO infrastructure is verifiable; indexing/rankings require publication and search-engine processing and cannot be promised.

Verification: typecheck, lint, unit tests, production build; browser checks of app regression, bilingual landing behavior, isolation from shop storage, SEO HTML with JS disabled, 320/390/768/1440px, zoom and reduced motion.
