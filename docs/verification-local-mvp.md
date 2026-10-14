# Verification — localStorage MVP

## Scope

Vite/React/TypeScript/Tailwind, DESIGN.md cobalt/white tokens, self-hosted Thai font. Data stays in the browser. No login or online database was selected or implemented.

## Automated checks

- Final rerun on 2026-10-14: typecheck, lint and production build all exited 0; service suite 14/14 and browser suite 7/7 passed.

- Public stock/persistence suite: 14 cases, including immediate deduction, idempotency, aggregated duplicate lines, full reservation conversion, bill delta corrections, price-only correction during shortage, stale bill versions, returns/exchanges, corrupt backup and storage failure.
- Browser suite: 7 cases on isolated Playwright contexts. Mobile workflow and PNG/JSON downloads, desktop empty state and overflow, Thai form validation, unsaved-data dialogs, corrupt-data recovery, two-tab stale bill editing, multiple stock drafts, accidental variant removal.
- Actual PNG exported from a test bill reviewed: .audit-qa/B00001.png. TEST-01 and test customers exist only in isolated tests, not the default app catalog.
- Fresh screenshots inspected at .audit-qa/mobile-empty.png, mobile-product-form.png, mobile-bill-form.png, desktop-empty.png, mobile-product-extra-variant.png.

## Independent review

Standards axis originally found stale draft overwrites, empty selection crashes, and incomplete dirty tracking. Spec axis found stale edits, unnecessary stock validation for price-only corrections, and incomplete linked-return backup validation. Reproductions were added and all reported findings fixed. Standards re-review and Spec re-review found no residual within the reviewed fixes; Spec reviewer independently ran 14 service tests.

Visual finish reviewer found missing removal of newly added variants. Removal now preserves existing variants and at least one row; regression proves first-row data remains and saving succeeds. Final visual disposition: ship.

Impeccable detector ran once. Off-ramp type sizes were aligned to DESIGN.md and modal scrim was given a semantic token. No browser result is inferred from build/lint alone.

## Boundaries

- Desktop Chromium emulation is not a physical-phone touch, virtual-keyboard or OS file-picker test.
- No authenticated cross-device access, cloud backup, deployment, LINE delivery or actual shop data verification.
- LocalStorage size is bounded; images are resized and writes fail visibly if quota is exceeded. Export JSON regularly.
- Bills with linked returns/exchanges cannot change quantities or be cancelled; price-only corrections remain allowed. Cancelling a bill from a reservation does not recreate that reservation.
- No Git repository exists in this workspace, so no commit was created.
