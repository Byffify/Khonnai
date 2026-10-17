# Settings navigation and Thai/English UI

## Implemented

Settings is a categorized list: Your shop / Shop details; Preferences / Language; Data and history / Backup and recovery, Stock movement history. Each row opens its own internal page with a labeled original Iconly back arrow. Returning restores focus to the originating row. Shop form state stays mounted while hidden so internal navigation and language changes retain drafts; leaving Settings still asks to discard unsaved edits. Damaged shop data opens recovery directly.

LanguageProvider owns Thai/English UI, document lang and cross-tab preference sync. Preference key khonnai-language is independent of micro-erp-v1. Failed preference writes still change the session language with visible feedback. Explicit React messages cover navigation, labels, dates, confirmations, errors, recovery and status. Product/customer/unit data remains literal. App dates retain Asia/Bangkok. Receipt renderer and its fixed fonts remain independent of app language.

## English font recommendation

The archived [Fastwork CSS inventory](fastwork/css-motion-inventory.md) declares Google Sans for body/heading, with system fallbacks. This is CSS declaration evidence, not proof of the final rendered font on every screen, and is not a font license.

Design judgment for Khonnai:

- Keep Plus Jakarta Sans with Anuphan for the current app: friendly, clear and consistent with the existing refinement.
- Manrope is the first alternative for a quieter, geometric feel.
- Inter is another option when familiar, neutral interface typography matters most.

Current official license records: [Plus Jakarta Sans](https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/OFL.txt), [Manrope](https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt), [Inter](https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt). Each declares SIL OFL1.1 and permits bundling with software subject to its conditions, including retaining copyright and license notices. No Latin font change or Google Sans download is included. Wordmark remains Rammetto One, navy to orange.

## Verification

- Typecheck, lint, unit tests18/18, production build and theme:check passed;69 generated tokens match DESIGN.md.
- Full browser suite27/27 passed, including original Thai business flows, English sale/error/discard/recovery, failed preference writes, cross-tab language changes, category/back focus and retained shop drafts. Fixed receipt PNG bytes match the approved fixture in both languages.
- Browser viewport checks320/390/768/1440px; existing CSS zoom200% and reduced-motion checks passed. Native language select and file picker retained. Screenshot review found an awkward English reservation-label wrap; compact visible Reserve keeps the full accessible Reservations name.
- Premium strict static audit:0 findings. Impeccable detector exits1 with four incumbent findings: two radii in unimported App.css, current Plus Jakarta Sans and the explicitly approved gradient wordmark. These are recorded exceptions, not a claim of a clean detector run.
- Screenshots in outputs/language-settings include Thai menu390/1440, English menu1440, Thai shop subpage/back390 and English language subpage/back390. Data is synthetic and isolated from real shop storage.
- Desktop Chromium emulation does not certify physical-device touch, OS picker UI, browser-chrome zoom or a screen-reader audit. No landing implementation or business schema migration.
