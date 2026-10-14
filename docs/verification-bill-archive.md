# Daily bill archive and stock color — 2026-10-14

- Saved bills grouped by Bangkok calendar day, newest day first; date, count and active-bill total shown. This is a bill total, not profit/net returns accounting.
- Horizontal tabs show shared receipt icon, bill number and customer (explicit unnamed fallback). Cancelled bills remain accessible and labeled. Only selected receipt mounts; same full-paper renderer/edit/cancel/export actions retained.
- Keyboard tab behavior supports arrows/Home/End, selected state and named panels. Local selection does not change data/stock. Form and domain handlers unchanged.
- Stock disclosure uses requested pale green #bfdcbc with navy text and pale-green hover #afd0ac; product addition remains orange. DESIGN.md and sidecar updated.

## Evidence

- New public browser behavior test failed before implementation (no tablists), then passed after implementation. Covers Bangkok midnight grouping, no initial preview, one selected receipt, keyboard, cancellation and daily-total update.
-14/14 browser regressions passed, including bill editing/stale protection/long paper/PNG byte equality; final icon/pale-green change also passed targeted archive test.
-14/14 service tests passed; typecheck, lint and build passed.
- Production check using12 synthetic bills on2 days: no page overflow at320/390/768/1280; tabs scroll locally; green stock and single selected receipt verified. Captures .audit-qa/bill-archive-*.png and stock-green-mobile.png.
- Existing regression/production scripts were updated to select the saved-bill tab before viewing/exporting, as requested.
- Actual phone and shop-owner usability not tested. No localStorage migration or user-data change.
