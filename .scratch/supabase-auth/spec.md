# Supabase migration and authentication

Source: docs/research/supabase-auth-and-usage-design.md. User authorization: 18 October 2026.

## Active cloud inventory delivery, 18 October2026

User authorizes starting each Supabase shop empty: localStorage records are demo data. Do not import, overwrite or delete local demo records. Keep production deployment and public landing unchanged. Connect the existing operational UI behind a protected staging /shop route; /app remains the isolated local demo until release verification.

Architecture phases: ground existing State/Command and Auth; compare persistence candidates; implement trusted command store + API + injected UI persistence; verify unit/HTTP, real staging transactions/RLS/concurrency and browser flows. No new visual approval gate for this persistence change.

Throughput checkpoint: three independent units (transactional store/schema, command input validation, frontend adapter) with separate file ownership; root owns HTTP integration, migration application and verification. Each unit must return executable tests before integration. Stop treating a mock/build as evidence of real persistence.

Caller contract: createInventoryStore(appPool).load(userId), .commit(userId, expectedRevision, Command), .lookup(userId, commandId). HTTP derives userId from the existing verified opaque session; the client cannot select a shop. Store reconstructs State from tenant-scoped relational rows, executes the existing domain engine under a per-shop row lock, commits relational changes + command receipt atomically, and returns committed State. Retry receipt is checked before revision and verifies canonical command hash.

Compared shapes: (A) direct database RPC per operation rewrites all existing domain rules in SQL; (B) trusted BFF runs the existing tested execute over relational hydration under shop lock. Select B to retain one authoritative behavior engine and exact historical bill snapshots. Do not accept client state snapshots for writes. Keep private photo data URLs in RLS-protected database rows for this bounded release (existing4.5MB State limit), rather than changing receipt rendering to expiring Storage URLs. Private object Storage/export packaging remains a separate delivery.

UI cloud state is account-bound and memory-only, with no business-data local fallback. Preserve in-memory command identity across unknown outcomes, reconcile receipts before retry, and clear/unmount on account change. Latest account-backed reads replace confirmed state only. Local backup/import is not automatically executed in cloud mode. User-reported Auth success does not imply every email recovery gate has independently passed; continue tracking those gates separately from cloud command tests.

## Required outcome
Verified account/shop isolation, transactional inventory commands, private presenter demo, honest usage report and safe legacy import. Preserve landing composition, workflows and paper/PNG output. Local/staging only. No production deployment and no deletion of existing local data.

## Historical prototype delivery gate, completed before Auth implementation
Deliver an isolated TH/EN login prototype for user review BEFORE connecting real authentication or store records. Independent plans and architecture sketches may proceed. Do not silently convert a visual approval gate into permission to connect.

## Named data shape
Prototype uses one in-memory AuthPreview state: language, appearance variant, screen (welcome/email/password/signup/recovery/check-email), entered email, transient message, pending simulation. It has no user/session/authorization truth. Passwords remain in input elements only, never in URLs, logs or persistence. Backend target: account -> shop membership -> shop records, with command ID and committed receipt.

## Acceptance for this delivery
Official skills installed and provenance recorded; Local Markdown tasks exist; prototype shows supplied composition with Noto, navy/orange glow, TH/EN, desktop/mobile and usable field feedback; no auth request, localStorage, shop mutation or successful-login simulation; evidence and next setup steps available. Unexecuted security/provider/RLS tests explicitly remain NOT VERIFIED.
