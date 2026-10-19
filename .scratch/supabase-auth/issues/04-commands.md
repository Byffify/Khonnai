# Move transactional commands and photos

Status: done
Blocked by: Auth session core delivered in03; final real-email recovery acceptance remains a release gate in07

## Acceptance
Concurrency, retry, unknown outcome, bill/PNG parity.

## Comments
Transactional cloud inventory delivery is complete in local/staging. Broader release gates remain in07.

18 October2026: user authorizes cloud shops starting from zero because localStorage holds demo records. No legacy import or local deletion. Implement relational trusted BFF commands with empty initial shops, account-bound /shop staging UI, same domain rules and receipts. Keep /app local demo and landing isolated pending cloud release. Photos remain private RLS-protected DB data URLs within existing size limits for this delivery; object Storage remains tracked separately. No production deploy.

18 October2026 verification: CLI migration20261018134456 recorded after rollback-only DDL/RLS/FK proof. Real scoped PostgreSQL store passed all12 commands, exact relational roundtrip/order, failed-exchange atomic rollback, tenant read/write/receipt denial, transaction identity reset, last-pack concurrent sales, digest mismatch rejection and stale-revision retry receipt. Real provider/browser check passed empty shop beside untouched corrupt local-demo sentinel, uploaded photo persistence, separate signed-in context reads, TH/EN and320/390/768/1440menus, revoked-session closure, and byte-identical receipt fixture PNG. Lost POST response plus temporary Auth503 preserved pending identity and reconciled with exactly one POST. All original account IDs remained present; only newly generated fixture UUIDs were cleaned. Independent source review found the transient-session pending-loss defect, five regressions failed before fix and passed after, then reviewer independently reran12/12client tests and accepted fix. Unit/HTTP92/92, typecheck/lint/build pass. Full original browser verification is recorded in release comments after its final run. No production audit claim.

Limits: complete State4.5million characters, relational graph rewrite under shop lock per command, private DB inline photos rather than Storage bucket, memory-only pending commands with beforeunload warning, cloud restore not implemented. Backup export works; local /app restore unchanged. See docs/research/inventory-staging-guide.md and outputs/inventory-staging/live-verification.json. Demo/usage remains05; local import06 removed by user.
