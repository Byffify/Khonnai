# Consistent back navigation — 2026-10-14

Shared BackButton in src/ui.tsx uses an authored arrow and visible “กลับ”. Product detail/create/edit, bill create/edit and reservation create place it above the title, aligned left. Product detail no longer shows the parent catalog heading/add action above the back control; adding products remains available on the catalog grid.

The hit area is48px tall, with transparent resting background, existing action-surface hover and visible keyboard focus. Brand tokens and existing App leave/ask handlers remain unchanged. Product detail keeps the descriptive accessible name and grid-focus restoration. Primary menu pages and in-place bill archive previews retain their existing navigation.

Fresh verification:

- Build including TypeScript, lint and19 browser regressions passed. Unsaved stock/form cancellation, focus restoration, PNG export and other workflows remain covered.
- `.audit-qa/back-check.cjs` passed six secondary screens at320/390/1280px: one back control above the title, text+SVG, minimum48px hit area, no horizontal overflow and unchanged stored data.
- Visually inspected mobile product detail capture `.audit-qa/back-detail.png`. Other captures are `.audit-qa/back-{add-product,edit-product,add-bill,edit-bill,reserve}.png`.

Validation used isolated synthetic data and desktop browser viewports; actual-device and screen-reader behavior were not tested.
