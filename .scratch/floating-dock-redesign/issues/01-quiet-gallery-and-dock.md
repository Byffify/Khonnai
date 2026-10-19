# Apply Quiet Gallery and shared Floating Dock

Status: done
Blocked by: none

## Scope

Implement the approved Quiet Gallery with image and code together, glass bottom navigation at every screen width, and consistent operational surfaces on Products, Bills, Reservations, Returns/exchanges and Settings.

## Acceptance

- Two phone / three tablet-desktop gallery columns; no fake product photos in real shop data.
- One five-destination dock with labels, selected/busy state, visible keyboard focus, safe-area and content clearance.
- Preserve size-first detail, stock editors, native controls, data guards and frozen receipts.
- Validate Thai/English, 320/390/768/1024/1440, reduced motion and existing workflow tests.

## Comments

- 2026-10-19: User approved Quiet Gallery and asked to start. Feature branch created; existing auth/loading and browser test changes retained.
- Implemented Quiet Gallery photo/code footers, filtered code count, desktop detail workspace, shared page headings and glass Floating Dock on all five pages and viewport sizes. English visible Reserve/Returns retain full accessible names.
- Red/green evidence: old edge-to-edge dock failed inset assertion; selected-hover gray failed selected-blue assertion; narrow Products heading failed72px versus40px. Fixed each and covered in browser regression.
- Final checks passed: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run theme:check` (76 tokens), `npm.cmd test` (95/95), `npm.cmd run test:browser -- --reporter=line` (36/36).
- `node.exe .scratch/floating-dock-redesign/verify-ui.mjs`: 50 page/locale/viewport combinations,29 real-app captures; checks targets, final-control clearance, deliberate size selection, focus, reduced motion, forced colors and console errors. Demo browser data uses existing illustrative landing photos; real shop records are untouched.
- Premium strict static audit:0 findings. Fresh independent finish review inspected all24 initial screenshots, then320px English selected states and corrected captures; both findings and final heading polish resolved. Documentation sidecar updated; receipt-isolation browser test passed.
- Environmental failures were separated from app assertions: sandboxed local HTTP connections returned EACCES; concurrent build caused an interim page-detachment timeout; Windows rejected writes into two existing screenshot reference files. Localhost tests ran with process access, final build preceded browser tests, and affected captures now use `testInfo.outputPath`.
- Impeccable CLI context loader was unavailable due cache permissions; existing project context and independent manual screenshot review were used. Static audit is not an axe/WCAG certification. Physical phones, actual device safe areas, live backend deployment and production validation were not performed.
- Follow-up: user asked to see concept C navigation. Opened and visually confirmed the actual app at `http://localhost:5173/app` in the in-app browser. Refined the dock from rounded rectangle to full capsule, reduced desktop menu height to64px, preserved72px mobile targets and14px labels, and added subtle orange/navy edge shadows with82% white glass. Updated canonical tokens and component sidecar.
- Follow-up checks passed: `npm.cmd run build`, `npm.cmd run lint`, `npm.cmd run theme:check`, and `npx.cmd playwright test -g "quiet gallery and floating dock" --reporter=line` (1/1). Capture verifier passed50 combinations with31 captures, now including two viewport-only images so dock position is visible at the actual screen bottom. An initial immediate focus-visible assertion failed while browser checks ran concurrently; the diagnostic rerun completed in isolation and passed focus and forced-colors checks. No product focus behavior was changed.
- User requested stronger glass blur: raised canonical dock blur24→40px and reduced white opacity82→68%. Navigation labels/icons use opaque navy to retain contrast over content; selected item remains opaque pale blue. Build and76-token drift check passed. Capture verifier passed50 combinations, focus/forced-colors/clearance and31 refreshed captures; visually inspected the updated live preview and desktop capture.
- Second glass refinement: user requested more visible glass material. Dock now uses64px blur,1.8 saturation and52% white base with a diagonal reflective sheen and inset light-catching edges. Default labels/icons use opaque ink; selected surface and shape remain unchanged. Build and77-token drift check passed; capture verifier passed50 combinations with33 captures including scrolled-content glass views. Inspected desktop/mobile captures; synthetic photos remain confined to the verification browser context.
- Commit/push verification: exported the staged tree into a temporary workspace, excluding pre-existing CloudApp/SiteEntry/ShopLoading changes and two loader tests. Updated the existing navigation appearance assertion for the approved52% glass/64px blur. Build (including TypeScript), lint, unit95/95 and full browser34/34 passed on that exact source snapshot. Initial theme check exposed Windows CRLF conversion of generated CSS; `.gitattributes` now fixes `src/styles/tokens.css` to LF and the77-token check passed after a fresh index export. No Auth/loading changes are staged for this delivery.
