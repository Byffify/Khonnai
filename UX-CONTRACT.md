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

- Secondary product detail/create/edit, bill create/edit and reservation-create screens use shared BackButton above the title at the upper left. Visible label is “กลับ” with an arrow; product detail keeps its descriptive accessible name. Existing App leave confirmation and return destination/focus remain. Primary menu screens have no back control.

- Failed form commands use shared Form feedback beside the submit action, focus and scroll to it, and retain inputs. Each failure has a new focus request so identical retries work without Web Locks. Page-only errors use focused Notice fallback. Field validation restores prior unit/hint descriptions after correction.
- Transaction lines start with an empty required selection. Shared code filtering has a clear control, preserves selected variants and full context, and is transient rather than an unsaved data edit.
- Replacing or clearing a nonempty incoming return draft through bill-reference selection requires confirmation. Cancel/Escape preserve reference, quantities and outgoing replacements.
- The visible settings menu is “ร้าน/สำรอง”; the existing accessible name and route remain. Stock remaining/reserved counts carry units; quantity fields show their selected unit.

- Bill archive groups saved bills by Asia/Bangkok calendar day, newest day first. Horizontal tabs carry receipt icon/number/customer; selecting mounts only that receipt and its existing edit/cancel/export controls. No receipt is shown before selection. Arrow keys/Home/End navigate tabs; unselected receipts do not generate PNG previews.
- Daily archive total sums current active bill line amounts only; cancelled bills remain findable and are excluded. It is not a net-refund or profit report, and does not write stock.

- Khonnai branding changes presentation only: navy save/navigation, orange additions, mint readiness, cream canvas and readable8px controls. Business states, route labels, field order and localStorage remain unchanged; the full paper receipt and PNG share current palette/fonts and preserve shop identity.

- Responsive navigation has one shared owner in App: mobile bottom navigation and desktop sidebar at 1024px, with the same Thai labels, active state, busy state and unsaved-change guard.
- Catalog uses native button tiles showing only photo and code: 2 columns on mobile, 3 at 601–1150px, 4 above1150px. Selecting opens a detail view without preselected size; explicit size selection reveals colors, quantities, units, reservations, shortages and existing stock actions. Back restores search and focus to the selected tile. Leaving details, editing or changing size uses the existing unsaved-change guard. Navigation and size selection do not write data. Products retain their existing code-only identity; no name field or storage migration is added.
- Form columns and bill summary placement change with viewport width; validation, save destinations and data fields remain unchanged.
- Selected transaction variants show complete code/size/color/unit/price/availability below the native select, even when its displayed option is clipped.
- Bill total and its single submit action precede the full paper preview in DOM order; preview/export renderer and save semantics stay unchanged.
- Stock receive/count mode has operation-specific labels and before/after preview. Replacement count confirmation states the old and new quantities.
- Returns/exchanges choose operation first; incoming and outgoing lines have distinct labels, with a pre-save stock-effects preview. Condition still applies to all incoming lines in that submission.
- Corrupt storage presents recovery-only content; ordinary catalog/create screens and non-recovery navigation are blocked until valid import. Original raw-data download and backup replacement confirmation remain available.

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
