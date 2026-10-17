# Khonnai Fastwork redesign — implementation evidence

17 October2026. Approved preview implemented in the local app on branch codex/fastwork-redesign. This is a local browser build, not a deployment or real-device certification.

## Delivered

- White mobile bottom navigation / desktop sidebar at1024px; same five destinations, names and guards.
- Shared typography, surfaces, inputs, buttons, chips, feedback, dialogs and operational page layouts. Catalog remains photo/code → explicit size → colors/stock; detail adds the product photo and responsive color-card grouping.
- Self-hosted Rammetto One wordmark: **navy #193b5a on the left → orange #ed7c32 on the right**, with a solid navy/forced-colors fallback. Thai UI and receipt fonts retain their roles.
- Eight Iconly Light SVGs for the five main menu roles, back, search and product image. See [asset provenance/license boundary](../iconly-assets.md). Simple geometric utility symbols keep existing paths.
- DESIGN.md → scripts/build-theme.mjs → src/styles/tokens.css; independent --receipt-* tokens. UX-CONTRACT.md and illustrative Impeccable sidecar reconciled with the approved visual system.
- Control125ms, selected160ms, content220ms/6px, stock disclosure240ms, dialog280ms. Visual loading waits225ms while duplicate-save protection remains immediate. Reduced motion keeps final states visible.
- No changes in src/domain or src/data; no storage key/schema/API migration. Landing references retained for later work.

## Commands actually executed

| Check | Result |
|---|---|
| npm.cmd run theme:build | Generated62 tokens from DESIGN.md |
| npm.cmd run theme:check | Pass, no token drift |
| npm.cmd run typecheck | Pass |
| npm.cmd run lint | Pass |
| npm.cmd test | 14 passed,0 failed |
| npm.cmd run build | Pass, TypeScript + Vite |
| npm.cmd run test:browser | 22 passed,0 failed,0 skipped |
| npm.cmd run test:browser -- --grep "Fastwork presentation" | Final capture confirmation passed |
| Premium audit_project.py D:/Khonnai --mode strict | 0 findings; JSON in outputs/fastwork-preview/premium-audit.json |
| Impeccable detect src --json | Four nonblocking findings; JSON in outputs/fastwork-preview/impeccable-detect.json |

Python audit used the bundled Python runtime because the WindowsApps python alias was unavailable. Premium manifest records the existing native-select ownership. Impeccable flags the explicitly approved Plus Jakarta font and wordmark gradient; its other two findings concern unused App.css (not imported by main.tsx). These are not runtime failures or permission requests.

## Browser evidence

Existing functional assertions retained; old theme assertions updated to the approved white/navy selected surfaces and capsule CTA. A timing-sensitive color assertion now waits for the CSS transition's final value with Playwright's auto-retrying assertion.

Coverage includes product create/edit, receive/count, deliberate transaction selection, sale/receipt export, bill edits and revision conflict, reservation conversion, returns/exchange, backups/import, corrupt-data recovery, storage failures, local error focus and unsaved draft guards. Pending-save test holds a real Web Lock to verify immediate disabling, delayed indicator and a single persisted product.

Presentation test checks all five pages plus product size/color disclosure at320/390/768/1440px, long Thai codes, document overflow, loaded wordmark font and gradient direction, reduced motion and first-invalid-field focus. Enlarged layout uses Chromium CSS zoom200%; browser chrome/OS zoom and real-device font scaling remain manual checks.

Actual app screenshots: outputs/fastwork-preview/app-{catalog,detail,bills,reservations,returns,settings,sale}-{390,1440}.png; wordmark.png and app-zoom-200.png. Data is synthetic and inserted only into isolated browser-test contexts. Inspected mobile/desktop catalog, detail, returns, settings and sale compositions together; final sale/wordmark captures confirmed after the main inspection.

Fixed receipt fixture, date and font: generated PNG matches the pre-redesign receipt-baseline.png **byte for byte**, including when app ink/selection/font tokens are changed. Separate browser coverage confirms preview/export equality. Baseline SHA256 remains778b4ea046c3b4155c801e49287d1a66079e417c42f15a3cc8a8fcd0bde45015.

## Verification limits

Static tool output is separate from app browser evidence. No package file:// gates were used as proof of React rendering. No full axe/screen-reader audit, real-device OS file-picker interaction, production data or deployment check is claimed. Confirm Iconly commercial entitlement before paid distribution; see the linked source/license record. Landing is reference-only.
