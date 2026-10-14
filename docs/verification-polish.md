# All-page polish — 2026-10-14

Refinement of current Khonnai UI only. Brand color tokens, logo, domain/storage logic and flows unchanged. Incumbent DESIGN.md and current five-page runtime were the authority. Critique latest helper returned exit1 without output; no backlog identity loaded/closed in this pass. Prior five fixes were independently verified before this request.

## Changes

- Unified16px labels/18px inputs; back/title baseline; numeric tabular figures.
- Transaction rows align product/quantity/remove controls independent of unit hint height.132px quantity column desktop,112px mobile; remove retains mobile full-row placement.
- Cream focus ring on navy navigation, safe padding around bill-tab focus, consistent disabled hover/press, existing danger border on invalid fields, neutral disabled suffix fields.
- Backup picker displays Thai app text while retaining native file selection, accepted JSON types, confirmation, validation and accessible name. File selection behavior is unchanged.

## Verification

-18/18 browser regressions passed, including backup/recovery, selection/drafts, errors, bill revisions, cash-paper export and PNG byte equality.
- Build (including TypeScript) and lint passed.
- Five pages at320/390/768/1280: no document overflow; font readiness, reduced-motion save and PNG export passed.
-72-variant focused production check passed: selection/filter, visible error, return draft cancellation, four widths.
- Explicit control-top alignment at320/390/1280 and cream keyboard focus passed. Batched visual inspection: populated desktop bill editor, mobile returns and desktop settings/backup.
- Detector ran once; preserved previous inactive App.css/taste/overridden-color/documented22px advisories. Not a warning-free claim and not grounds to replace approved brand.

No user browser data changed; isolated synthetic contexts only. Preview restarted at127.0.0.1:5180 for inspection. Actual phone/touch OS picker, screen reader and browser200% zoom were not exercised.
