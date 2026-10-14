# Ready-stock color refinement — 2026-10-14

The user clarified “Published items” as products marked **พร้อมขาย**. This is an availability display, not a new publishing workflow. All brand color values, localStorage schema/key, stock calculations and existing flows are preserved.

## Changes

- Ready product overview uses existing stock-surface; its availability quantity uses success green.
- Shared StockStatus combines text and authored SVG: check/พร้อมขาย, minus/หมด, warning/ของไม่พอ. Ready badge uses existing mint stock-action. The same component appears for each size/color variant.
- Selected-size availability and shortage priority remain unchanged. A ready summary does not imply every color or every size is ready; individual variant status is visible when expanded.
- Bill, reservation, return and backup workflows retain their meanings. Paper receipt and exported PNG are not tinted as ready-stock items.
- DESIGN.md documents the existing semantic colors' new use. No palette or brand assets changed.

## Verification

- Build including TypeScript: passed. ESLint: passed on rerun after browser tests (first parallel lint encountered transient test-results directory removal).
- Existing Playwright workflow suite: 18/18 passed. First sandbox attempt stalled reaching its test server; the verified runner/server from that attempt were stopped and the suite reran successfully with local socket access.
- `.audit-qa/colorize-check.cjs`: ready/empty/shortage, selected-size transition, unchanged stored state and no horizontal overflow at 320/390/768/1280 passed in isolated synthetic contexts.
- Contrast: ready badge 4.81:1, empty 6.36:1, shortage 5.98:1, green quantity on tinted overview 6.32:1. Icons/text provide non-color cues.
- `.audit-qa/redesign-check.cjs`: five pages at four widths, loaded Thai font, PNG export and reduced-motion save passed.
- Visually inspected mobile/desktop captures `.audit-qa/colorize-390.png` and `colorize-1280.png`.
- Detector found four existing advisories: unused App.css radius, approved Plus Jakarta font, overridden legacy color and sidebar font size. This refinement introduces no new literal colors or radii.

Coverage uses desktop browser simulation; actual phones, screen readers and color-vision simulation were not tested. No production merchant data was modified.

## Follow-up: simpler cards

After the user reviewed the tinted overview, removed its extra padding/background. The card now has a single white surface; green remains on the quantity and ready badge. Summary badge follows the quantity rather than being pushed to the far edge; the chevron is vertically centered. DESIGN.md and the QA script were updated accordingly.

Fresh checks: build including TypeScript and lint passed; isolated colorize browser check passed at 320/390/768/1280, including selected-size transitions and unchanged stored state. Green quantity on white measures 7.13:1; ready badge remains 4.81:1. Mobile and desktop captures were visually inspected. The full workflow suite above was not rerun for this CSS-only follow-up.
