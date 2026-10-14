# Operational UI redesign — 2026-10-14

User requested simpler UI after reviewing four screenshots: too many pill shapes and unclear action colors. This takes precedence over the earlier Hume marketing shape/action rules. Palette identity remains cream/lavender; behavior and storage are unchanged.

## Changes

- Shared controls8px, cards/dialog12px, size selectors6px. Pills retained for small status badges.
- Primary actions blue #174ea6 with white text; secondary add/export white with visible neutral border; destructive red; unavailable submit gray; stock addition green-tinted with plus and existing concise label.
- White inputs differentiate entry from cream page and action buttons. Shared labels/buttons use the readable body/Thai font rather than monospace.
- Removed nested card outlines from return-form groups; used separators and headings. Secondary controls fit content; mobile primary submission remains wide.
- Product list keeps code → size → color/unit hierarchy and quantities. Product hover uses a soft edge shadow. Lavender navigation and dark selected state retained.
- No new instructions/explanatory paragraphs added to stock control. No fields, commands, domain handlers, localStorage schema, routes, or receipt geometry changed.

## Verification

- Build (includes TypeScript check) and lint passed.
-13/13 browser tests passed, including all existing workflows, recovery, selected context, stock count, PNG equality and the updated shape/action assertions.
- Production app at127.0.0.1:5180: five pages across320/390/768/1280 widths, no document overflow, exported receipt and reduced-motion save passed.
- Batched visual inspection: expanded mobile catalog, desktop returns and mobile backup/settings. Captures .audit-qa/operate-*.png and .audit-qa/redesign-mobile-expanded.png use synthetic test data only.
- Real shop device/owner usability not tested. No claim of exact Hume typography or pixel-identical marketing UI.
- Impeccable detector ran once. Advisories about intentional6px selectors/navigation font/hover gray were documented; unused App.css and generic font-popularity warning do not describe a runtime defect. Not reported as a warning-free scan.
