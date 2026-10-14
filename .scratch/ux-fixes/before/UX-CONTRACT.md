# Micro-ERP UI contract

## Canonical owners

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Form | Form / Field in src/ui.tsx | UX-CONTRACT.md | create / edit | tests/browser.spec.ts |
| Select/Listbox | Native select in shared ItemsEditor and feature forms | UX-CONTRACT.md | native OS popup | tests/browser.spec.ts |
| Scrollbar | src/index.css | DESIGN.md | global baseline | viewport checks |
| Toast | Notice / App report | UX-CONTRACT.md | status / error | tests/browser.spec.ts |
| CRUD | feature lists / inventory execute | PRODUCT.md / UX-CONTRACT.md | list return / form stay | tests/browser.spec.ts |

## Owner behavior

| Capability | Owner | Behavior |
| --- | --- | --- |
| Forms and fields | Form / Field in src/ui.tsx | App-owned Thai validation, no native bubbles, focus first invalid field, preserve input |
| Select | Native select within a visible label | OS popup and keyboard behavior accepted; application controls options and label |
| Confirmation | src/ConfirmDialog.tsx with App ask | Native dialog modal, Thai action labels, initial cancel focus, Escape cancel, focus restoration |
| Feedback | Notice in src/ui.tsx, App report | Text plus semantic tone, status/alert; failure never clears form |
| Scrollbar | src/index.css | Global visible themed scrollbar, stable gutter, forced-colors fallback |
| CRUD transitions | Feature owning lists | Catalog/bill/reservation create returns to list; returns form stays with history for consecutive receipts; settings save stays in settings |
| File selection | Native file input with Thai label | OS file picker accepted; photo upload is compressed before persistence |

## Locale and state

- Responsive navigation has one shared owner in App: mobile bottom navigation and desktop sidebar at 1024px, with the same Thai labels, active state, busy state and unsaved-change guard.
- Catalog cards use native details/summary for keyboard-accessible disclosure. The compact quantity totals availability for the selected size only; expanded rows show each color separately with units, reservations, shortage and existing stock actions. Disclosure and size selection do not write data.
- Form columns and bill summary placement change with viewport width; validation, save destinations and data fields remain unchanged.

- Thai labels, th-TH number/date formatting. Business timezone Asia/Bangkok for bill exports.
- Search is immediate local filtering with clear action; query is transient and is not placed in a shareable URL containing shop data.
- Every sale is a recorded bill and deducts stock immediately; pure export must never write stock.
- Active reservations reduce availability; converting uses all items and releases the hold once.
- App persistence uses browser Web Locks where available and revision checks; storage failure leaves prior data intact.
- Corrupt existing storage blocks writes. Download original raw data for recovery or import a valid backup; never silently erase it.
- Import replaces all local records only after app confirmation; export current data beforehand.
- Linked returns/exchanges lock quantity edits and cancellation; price-only edits remain permitted. Cancelling a bill from a completed reservation does not silently recreate the reservation.
- This is local browser storage, not authenticated or cloud-backed. Clearing site data can remove records.

## Verification

Public-service tests in tests/*.test.mjs; browser workflow/mobile/desktop, PNG export and backup tests in tests/browser.spec.ts. Real device touch/OS file-picker behavior is not proven by desktop browser emulation.
