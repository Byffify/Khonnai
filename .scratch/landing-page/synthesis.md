# Landing architecture synthesis

Base: candidate A, an isolated pathname decision in main.tsx. Preserve the current operational app at / and render Landing at /landing or /landing/. Shared LanguageProvider remains sole owner of language preference. The UI worker owns Landing.tsx / landing.css / optional landingCopy.ts; root owns entry/tests/docs. No router or dependencies added.

Alternative: candidate B, separate Vite HTML entry. Both preserve root app contracts. A scores9/10 and B7/10 on root safety, maintenance, storage isolation, design/locale reuse and the confirmed interactive composition. A wins current scope by avoiding a second HTML/build/hosting contract. The independent judge agreed; review used the same available model family, not diverse Cursor models.

Graft B's isolation criterion: dynamically import the operational App only on the operational branch. Landing must never execute shop storage reads/writes, proven by instrumenting micro-erp-v1 access in the browser, including corrupt seeded data. Both candidates' honest local-data explanation is retained. Do not implement online backup or login.

Named data shape: a static variant table with size M/L and color black/white owns illustrative stock24/18/16/12. One local selection value owns current size/color; changing size clears color until chosen. Fixed example quantity2 yields before -2 = after. No command/storage layer is imported; this is an explicitly labeled demonstration.

Visual base: user's confirmed large heading + product stage. White/navy/orange Fastwork foundations from archived MD; Anuphan Thai / Plus Jakarta Latin, Rammetto wordmark, shared Iconly. Larger landing type and authored scene transitions belong only to scoped .landing selectors. All product claims must be traceable to PRODUCT.md. No fabricated customer metrics or pricing.

Review and verification pending implementation.
