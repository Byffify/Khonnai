# Hume theme verification — 2026-10-14

## Scope and reference

Adapted the user-supplied hume.design.md, preserved at docs/design/reference/hume.design.md, as visual reference data. Marketing claims, SEO, logos and unrelated product functions were not adopted. The interrupted Duolingo direction was replaced by Hume.

DESIGN.md, shared CSS/tokens and self-hosted fonts now use warm cream #fff9f3, near-black #222222 actions, thin borders, pill controls, rounded cards and pastel information surfaces. Thai remains IBM Plex Sans Thai Looped. Plus Jakarta Sans500 and IBM Plex Mono400 are the reference's suggested substitutes for unavailable Fellix/PP Fraktion files; this is an adaptation, not a claim of exact proprietary typography.

The reference contradicts itself about cream/white canvas and input foregrounds. The implementation chooses the stated cream intent and readable ink on cream. Body18px, labels16px, captions14px and controls52px remain suitable for the shop workflow. Decorative marketing orbs/footers were not added.

No domain/service/storage/schema or feature-handler changes. Navigation labels, form order, full paper bill, stock rules and localStorage remain. The receipt renderer reads palette/font tokens; on-screen receipt and exported PNG use that same renderer.

## Verification

- npm.cmd test: 14/14 service/persistence tests passed.
- npm.cmd run test:browser: 13/13 passed, including sales, reservation conversion, corrections, returns/exchanges, recovery/backup, paper receipt and PNG equality.
- npm.cmd run typecheck, npm.cmd run lint, npm.cmd run build: passed.
- Production browser check: five pages at320/390/768/1280px, no document overflow; font loaded, PNG export and reduced-motion save passed. Screenshots in .audit-qa/redesign-*.png.
- Final visual confirmation: mobile catalog and full exported paper; old blue total fill removed and replaced with the selected lavender token.
- Frontend Design Premium strict static audit: zero findings, saved in .scratch/hume-theme/premium-audit.json. This is static ownership/context validation, not proof of all usability conditions.

## Review

### Standards

Independent Standards agent could not run because its usage limit was reached. Implementer reviewed the saved baseline diffs directly: tokens drive shared styles and receipt palette; fonts are self-hosted with licenses; no business handlers or persistent data model were changed. No additional actionable issue found. This is not an independent Standards sign-off.

Impeccable detector ran once: unused src/App.css radius advisories; Plus Jakarta Sans generic-popularity warning (retained because the supplied reference explicitly recommends it);20px heading/brand advisories (documented in the typography ramp). App.css is not imported by the live app. Detector warnings were assessed, not reported as a clean scan.

### Spec

Independent review found one P2: the generic input padding overrode the search icon's text inset. Restored52px left padding after the theme rule. Targeted Hume browser test then passed with computed-padding assertions at390 and1280px. Reviewer found no further missing requirements or scope creep in inspected changes.

## Limits

Follow-up bottom-nav contrast refinement: mobile current menu now uses ink/cream, on a white paper bar with2px ink divider; desktop outlined selection remains. Build/lint passed. Production viewport check passed. Browser suite had12 passes and one hover-state assertion mismatch (dark hover versus default ink); moving the test pointer outside the menu resolved the targeted regression. No business behavior change.

Browser/viewport simulation only; actual shop phone and owner usability have not been validated. Custom original fonts were not provided. Existing localStorage portability limits remain. This folder has no Git repository, so no commit was made.
