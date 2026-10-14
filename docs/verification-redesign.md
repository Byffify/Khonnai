# Redesign verification — 2026-10-14

## Delivered

Approved reference-led compact catalog cards, native disclosure for existing size/color and stock controls, Thai icon navigation (bottom on mobile, sidebar at 1024px), consistent white cards/forms and desktop product/bill columns. IBM Plex Sans Thai Looped 400/600/700 is self-hosted with IBM's license; PNG export waits for regular and bold font loads.

DESIGN.md, font token and UX-CONTRACT.md were updated together. Domain commands, localStorage schema/key, sale/reservation/return/exchange logic and save destinations are unchanged. No mock data was imported into the real app, and no Dashboard, charts, Chat or notification feature was added.

## Verification evidence

- Test-first font regression failed on the old Noto font, then passed with IBM Plex.
- `npm.cmd test`: 14/14 service/persistence cases passed.
- `npm.cmd run test:browser`: 8/8 browser cases passed, including original workflow, stale bill edits, unsaved drafts, corrupt-data recovery, JSON/PNG downloads and keyboard disclosure. Responsive regression checks long free-text units at 320/390/768/1280px without document overflow.
- `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`: exit 0.
- Premium strict static audit with .scratch/redesign/premium-ui.json: 0 findings. The original scanner findings were addressed by documenting the canonical map and making shared validation/handler ownership explicit. Runtime behavior was checked separately.
- DESIGN.md official lint: 0 errors, 10 warnings (9 component-reference/orphan warnings and the existing blue-on-selected contrast warning, 4.39:1). Color tokens remain as requested; this report does not claim a full WCAG AA audit.
- Production visual check: five menus at four widths, selected font loaded, bill creation/export under reduced-motion; isolated test contexts only. PNG inspected for Thai text and ฿450.00 total. This is not a real-device keyboard/file-picker or shop pilot test.

## Standards

Initial review: 2 P2 findings — custom units could overflow and operational text/menu labels had become too small. Both were fixed with wrapping and readable type. Re-review: 0 residual findings. Review used source comparison against .scratch/redesign/before; browser checks provide runtime evidence.

## Spec

0 actionable findings. Existing feature/flow preserved and approved layout/font applied. Review was source inspection, not physical-device validation.

## Remaining boundaries

LocalStorage remains browser/origin-specific, with manual JSON backup and no login/sync/cloud backup. Physical phone and owner usability checks remain pending. Workspace has no Git repository; no commit was created. Before snapshots are kept in .scratch/redesign/before.

## Images

Representative captures in .audit-qa: redesign-mobile-catalog.png, redesign-mobile-expanded.png, redesign-production-desktop.png, redesign-production-bill.png, redesign-production-bill.png-export.png, mobile-product-form.png and redesign-desktop-product-form.png. TEST-prefixed records belong only to isolated browser checks.
