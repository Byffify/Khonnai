# Approved five critique fixes

User approved all five findings from .impeccable/critique/2026-10-14T11-16-24Z__src-app-tsx.md; this report is the pre-fix behavioral baseline in the non-Git checkout.

1. Failed business submissions must expose an actionable, focused error beside submit, retain inputs and leave persisted data unchanged. Shared feedback covers sales/stock/returns; page-only errors remain visible with focus fallback.
2. Changing return reference must confirm before replacing/clearing nonempty incoming draft. Cancel/Escape retain reference and quantities; confirmed replacement still uses original bill rows. Do not clear outgoing replacements or change return stock rules.
3. New transaction lines require deliberate variant choice (empty initial selection). Shared editor supports code filtering for sales/reservations/incoming/outgoing; filtering retains selected values and full context. Native selection and validation remain.
4. Visible settings menu must expose backup (“ร้าน/สำรอง”); keep route and accessible existing name “สำรอง / ข้อมูลร้าน”.
5. Remaining/reserved stock numbers carry units; stock and transaction quantity fields show unit hints. Existing units/pack rules/prices remain.

Preserve Khonnai palette/shapes, all domain commands/storage schema, full bill renderer/export, guards, responsive behavior. Regression seams already approved: actual browser workflows and persistence invariants. Do not infer complete real-device validation from headless tests.
