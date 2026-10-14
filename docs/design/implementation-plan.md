# Micro-ERP localStorage — Design and implementation plan

## Sources and execution

User selected localStorage and requested the cobalt/white system in DESIGN.md, then explicitly authorized implement. Execute inline in this session with TDD at the agreed public business-service seam. The older online/login requirements remain future work.

## Files and responsibilities

- `src/styles/tokens.css`: CSS primitives from DESIGN.md; semantic colors, font, spacing, radius.
- `src/index.css`: Tailwind import and @theme mapping plus responsive shell/form styles.
- `src/ui.tsx`: small native Button/Field/EmptyState primitives.
- `src/domain/inventory.ts`: public `execute(state, command)` and `availability(state, variantId)`; pure atomic stock/bill/reservation/return changes.
- `src/data/storage.ts`: validated versioned localStorage snapshots; commit only after successful writes; export/import backup.
- `src/features/BillImage.ts`: PNG export from recorded bill data without mutations.
- `src/App.tsx`: mobile Thai catalog, bills, reservations, returns/exchanges and storage settings, using shared components.
- `tests/inventory.test.mjs`: specification examples through execute/availability, one red-green slice at a time.
- `tests/browser.spec.ts`: browser mobile/desktop workflow and exported-image checks.

## Token mapping

DESIGN.md is normative. Map colors to `--color-primary`, `--color-ink`, `--color-canvas` and semantic warning/danger, radii to `--radius-control`/`--radius-product`/`--radius-pill`, font to `--font-sans`, and spacing to a 4px base. Tailwind supports theme variables: https://tailwindcss.com/docs/theme

Only create shared components that have concrete uses. Product selection, variant forms and bill history are feature compositions, not generic universal cards.

## Vertical execution slices

1. Add business test for receiving stock; verify red, implement the minimal public types/command and verify green. Repeat for sales, reservation/full conversion, corrections/cancellation, returns and exchanges.
2. Add persistence with schema validation and atomic commit behavior. Reject corrupt/foreign data with actionable errors; export/import validated JSON. Do not silently reset data.
3. Build catalog and initial stock with tokens/native controls and real empty states, then sell/bill, reserve/convert and return/exchange workflows.
4. Add bill PNG generation, photograph upload with bounded image size, bill editing/history and local backup controls.
5. Verify typecheck, lint, full public-service tests, build, browser workflows at mobile and desktop widths, PNG content and no overflow. Review both standards and spec.

## Safe default proposals for local implementation

- Once a bill has linked returns/exchanges, prevent quantity edits and cancellation that could restore the same stock twice; explain the restriction. Price-only corrections remain allowed.
- Cancelling a bill converted from a reservation releases stock; do not silently resurrect the old reservation.
- Keep stock adjustment event history without requiring a reason.
- Use PNG for bill images and JSON for manual backups. No cloud backup claim.

These are implementation choices for the local version, not earlier user answers. Surface limitations in UI and final report.

## Review focus

- Idempotent commands: repeated receipt/sale/return must not apply twice.
- Duplicate lines: aggregate quantities before availability checks.
- Corrupt/full storage: keep previous persisted data and show an error.
- Returned bills: never restore quantities twice through edit/cancel.
- Mixed packs and integer quantities: one size, full pack, and one stock allocation.

## Verification boundary

LocalStorage cannot implement authenticated cross-device access. No provider/account is selected. Git commit is possible only if the workspace is a Git repository; do not initialize Git without a need to do so. Browser tests must not mutate the user's real storage.
