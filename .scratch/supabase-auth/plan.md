# Execution plan

- [x] Read the Principles section of the poteto-mode skill.
- [x] Phase A: Frame.
- [x] Phase B: Design the workflow.
- [ ] Phase C: Run the loop.
- [ ] Phase D: Keep the audit trail.
- [ ] Phase E: Verify and hand back.

## Atomic units
1. Install official Supabase skills using skill-installer and record source/version.
2. Capture baseline and compare two auth/command ownership sketches before backend implementation.
3. Build isolated login prototype and browser review evidence. Pause dependent real integration for the user-requested visual review.
4. After approval, implement Auth and shop/RLS isolation, then transactional commands with server verification.
5. Implement private demo fixture/reset, honest usage aggregation and controlled local import.
6. Verify staging with actual provider, cross-account/API/DB and transaction tests. Never deploy production in this task.

## Throughput checkpoint
- Blocking first steps: prototype review precedes real auth/data connection; staging project and provider setup precede live security tests.
- Independent workstreams: parent owns prototype; architecture candidates write separate sketch files. Reviewers never mutate implementation files.
- Shared mutable state: app/storage/domain/receipt remain read-only in this delivery; one owner per artifact.
- Smallest safe decomposition: one prototype owner plus two read-only architecture perspectives, then independent review. No backend implementation fan-out before the sketch is settled.

## Verification boundary
Browser observations validate prototype behavior and visual fit only. They do not prove credentials, session security, RLS or database transactions. Docker/Supabase/psql were not found on PATH during initial inventory; no claim that a local database is available.

## Delivery 1 handoff

Skills installed and content checked against upstream commit c9be0e931b7930f7d02126d04774d904c381e7d7. Prototype A/B and TH/EN are runnable. The current Phase C unit is verified for isolated UI only. Phase D trail is updated; Phase E hands back the prototype. Issue02 waits for user review, issues03–07 are not implemented. Architecture B is a provisional sketch, not verified backend code.

18 October2026 update: user approved edge-only glow and authorized implementation. The visual review gate is satisfied. The next external prerequisite is a dedicated Supabase staging project and securely configured access. The prototype is still not an authentication implementation.

18 October2026 staging foundation: migration20261018090754 applied through pinned CLI with history; SQL role/RLS checks passed before and after, fixtures rolled back. Unit tests31/31, lint, typecheck and build passed. Eight protected baseline files unchanged. Next architectural unit remains the trusted BFF/session implementation and constrained runtime credentials; no cloud inventory writer is enabled. User chose team-member email testing before custom SMTP. No production deployment.
