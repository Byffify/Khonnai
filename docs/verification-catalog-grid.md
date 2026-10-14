# Catalog grid implementation — 2026-10-14

Implemented the user-approved prototype in outputs/catalog-grid/index.html.

- Product grid shows photo and code only. No size, color, quantity, unit or stock-status badge appears before selection.
- Two columns through600px, three through1150px, four above1150px. Missing-photo placeholders use the existing icon and brand canvas; uploaded photos use contain fit without cropping.
- Native button cards open the selected product's detail view. No size is preselected; selecting a size reveals its color/mixed-color variants and existing quantity, reservation, price and stock controls.
- Back preserves the search and restores keyboard focus to the selected card. The existing leave guard protects stock drafts when returning, editing, adding a product or changing size. Cancel/Escape retain the selected size and quantities.
- Reused existing VariantView, Form, StockStatus, Button, App leave/ask and stock commands. No Product schema/name field, localStorage key migration, brand token or inventory calculation changes.
- DESIGN.md and UX-CONTRACT.md reflect the approved behavior.

## Fresh validation

- TDD browser slice failed with the old visible quantity before implementation, then passed with explicit product/size selection.
- 19/19 Playwright browser regressions passed, including receive/count, oversale, drafts, reservations, bill edit/cancel, PNG byte comparison, return/exchange, backup/recovery and two-tab protection. Existing quantity checks now open the product and select its size.
- Build including TypeScript and ESLint passed.
- Production `.audit-qa/catalog-grid-live.cjs` passed at320/390/768/1280: expected2/3/4 columns, no horizontal overflow, no grid statuses, explicit-size details, search, focus restoration and unchanged stored state.
- Visually inspected production desktop grid and mobile detail captures. Screenshots: `.audit-qa/catalog-grid-live-1280.png`, `catalog-grid-live-390.png`, `catalog-grid-detail-1280.png`, `catalog-grid-detail-390.png`.

Checks use isolated synthetic data and desktop browser viewports. Actual-device touch, screen readers and live merchant data were not tested. Earlier colorize/disclosure-only helper scripts capture the previous layout; the current grid helper and maintained browser suite are the verification entry points for this layout.

## Follow-up: separate color cards

Each color/mixed-color variant now has its own white background, neutral border, existing card radius and20px padding. Stock actions and display remain unchanged. Fresh build/TypeScript and lint passed; the production helper now includes two colors under M and passed all four widths, search, focus and unchanged storage checks. Mobile multi-color capture was visually inspected. The full19-test suite was not rerun for this CSS-only follow-up.
