# Five approved critique fixes — 2026-10-14

Baseline: .impeccable/critique/2026-10-14T11-16-24Z__src-app-tsx.md. User explicitly requested all five; no new brand or domain/storage redesign.

## Implemented

1. Shared Form failure context receives domain errors and renders one focused alert beside submit. App captures the originating form before busy disables controls; page-only errors use focused Notice. Failure sequence handles identical retries without Web Locks. Inputs and persistence remain intact after failure. Field hint descriptions restore after validation.
2. Return-reference changes confirm before replacing/clearing incoming draft. Cancel/Escape retain reference and quantity. Outgoing replacements remain. Existing prefill and return/exchange rules retained.
3. Shared transaction editor starts empty and requires explicit variant choice. Code filter narrows variants; clearing/searching retains selected variant and full details. Query is transient for unsaved-change tracking. Existing tests now select fixtures deliberately instead of relying on first-product defaults.
4. Visible menu now saysร้าน/สำรอง; route and accessible name remain.
5. Remaining/reserved numbers carry units; receive/count/initial stock and transaction fields expose unit hints. Stock actions use the same shared Form feedback; opening product add/edit reuses the existing unsaved-draft guard.

## Verification

- Four new browser regressions. Initial tests failed for offscreen feedback, silent return-draft replacement and default first product, then passed after fixes. Additional stock overflow regression covers local feedback and unit hints. Repeated no-Web-Locks failure was reproduced as a failing focus assertion and corrected.
-18/18 browser tests passed, including existing stock, bill changes, reservation, returns/exchanges, recovery/backup, long receipts and PNG byte equality.
-14/14 service tests, typecheck, lint and build passed.
- Production five-page check at320/390/768/1280: no document overflow, font ready, PNG export and reduced-motion save passed.
- Additional production check with72 variants: code filtering, deliberate selection, safe-viewport error, return-reference cancel preservation and four widths passed. Visual inspection of fixes-mobile-error.png, fixes-desktop-search.png, fixes-return-confirm.png under .audit-qa.
- Batched visual inspection found the existing sticky desktop summary overlaying paper after error scroll. Summary now stays in normal grid flow; full-paper preview stays unobstructed. Confirmed with the same capture set and targeted error/paper regressions.
- Preview restarted at127.0.0.1:5180 after earlier server stopped; current built assets served. No user browser data changed; checks use isolated synthetic records.
- Frontend Design Premium strict static audit: zero findings. Impeccable detector ran once and retained the four previously assessed inactive/overridden/font-taste/documented-size advisories; not reported as a warning-free detector.
- Critique snapshot close helper returned exit1 without diagnostic output even with absolute paths. The five resolutions are recorded here; historical score remains unchanged and automatic snapshot closure is not claimed.

## Standards review

Independent reviewer found missing explicit search clear action and potential repeated identical failure focus. Both corrected; repeat was reproduced and regression-tested. Reviewer source recheck: both resolved; no actionable Fowler smell. This is a review against the recorded behavior baseline, not a Git diff (checkout has no Git repository).

## Spec review

Independent reviewer found stock-action errors outside shared Form and absent initial-stock unit hint. Both corrected; source recheck found no remaining spec findings. Stock overflow and initial-unit regression passed.

## Limits

Browser emulation and source checks only; actual owner/phone/screen reader not tested. No fresh critique score claimed. Khonnai palette and domain commands, localStorage schema/key and full-paper receipt/export remain.
