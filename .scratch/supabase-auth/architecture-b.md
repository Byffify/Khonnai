# Candidate B. Vercel backend with an HttpOnly session

Design sketch only. No connection, migration, database object, credential or security test is implemented by this document. The login prototype must receive user review before real authentication or shop data is connected.

## Existing integration points

`src/App.tsx` owns the current state, pending-save guard, dirty-form confirmation and navigation. Its `act(command)` already awaits a save and returns a boolean to feature screens. That is a usable replacement point for remote commands without changing the five operational flows. `src/data/storage.ts` currently reads `micro-erp-v1`, validates a complete graph and writes a complete snapshot. Its revision check and browser lock protect local tabs, not multiple devices.

`src/domain/inventory.ts` defines twelve command variants and the UI-facing `State`. `execute` computes stock, reservations, bill snapshots, return limits and revisions. It also creates timestamps itself. Server execution therefore needs an explicit trusted clock before deterministic parity tests. Existing IDs are arbitrary strings, including exchange IDs with `-bill`; a database migration must preserve them as text instead of assuming every historical ID is a UUID. No ADR directory exists in this checkout. The glossary distinguishes stock from stock available after active reservations.

## Caller usage first

The application awaits one capability for a shop. Feature screens keep their current `state`, `act`, confirmation and navigation props.

```ts
const opened = await shops.open()
if (opened.kind === 'signed-out') showLogin()
if (opened.kind === 'ready') {
  update(opened.shop.state)
  const result = await opened.shop.submit(command)
  if (result.kind === 'committed') update(result.state)
  if (result.kind === 'conflict') showRefreshWithoutDiscardingDraft()
  if (result.kind === 'unknown') showReconcileAction(result.commandId)
}
```

The session capability owns authentication and account changes. A shop handle captures the session generation. A result from an earlier generation cannot replace the current account's UI. No caller selects a user ID, supplies an admin flag, posts a whole state snapshot as a normal save, or manually coordinates stock and bill writes.

Proposed interface sketch follows. Bodies are intentionally absent.

```ts
type SessionView =
  | { kind: 'signed-out' }
  | { kind: 'signed-in'; accountId: string; generation: string }
type CommitResult =
  | { kind: 'committed'; state: State; commandId: string; replayed: boolean }
  | { kind: 'conflict'; revision: number }
  | { kind: 'rejected'; code: string }
  | { kind: 'signed-out' }
  | { kind: 'unknown'; commandId: string }
interface OpenShop {
  readonly state: State
  submit(command: Command): Promise<CommitResult>
  reconcile(commandId: string): Promise<CommitResult>
  exportBackup(): Promise<Blob>
  previewImport(file: File): Promise<ImportPreview>
  confirmImport(previewId: string): Promise<ImportReceipt>
}
interface ShopAccess {
  open(): Promise<{ kind: 'signed-out' } | { kind: 'ready'; shop: OpenShop }>
}
```

`ImportPreview` and `ImportReceipt` are owned by the import module. They contain destination shop, graph digest, entity counts, photo manifest, expiry and import ID. Transport schemas stay private. The existing `Command` union remains the domain vocabulary, not a promise to trust a TypeScript cast on network input.

## Module ownership

- `src/auth` owns the login state and a same-origin fetch client. It never imports a browser Supabase auth client.
- `src/data/shop-access` owns current-account state and the remote command interface. The local storage reader survives only as an explicitly requested legacy import source.
- `api/auth` owns provider redirects, email operations, callback exchange and logout.
- `server/session` owns a server-side session vault, token refresh and session verification.
- `server/shop` owns authenticated command validation, transaction execution and mapping relational rows into `State`.
- `server/import` owns preview, staged images, final import and receipts.
- `server/usage` owns cohort exclusions, audit-event ingestion and date-window reports.
- `supabase` contains reviewed schema changes after approval, not changes made during this design stage.

Server modules cannot be imported by the Vite bundle. Enforce that with build/import checks and scan the final public bundle for forbidden environment variables. Use one production writer. A network failure must not activate local-only writes.

## Session and login protocol

Use a same-origin Vercel Node backend for every authenticated request. The browser holds only a random opaque session identifier in a `Secure`, `HttpOnly`, `SameSite=Lax`, host-only cookie with `Path=/`. Use the `__Host-` prefix in HTTPS staging and production. Local HTTP development needs a separate cookie configuration and name. Cookie expiry and server expiry agree. The server stores a hash of the opaque identifier and encrypted provider tokens in a private vault. Rotate the identifier after login and sensitive changes.

This is a dedicated backend session architecture. It is not the ordinary Supabase browser-plus-SSR cookie setup. Supabase's advanced guide says its normal browser client needs token access. Do not apply `HttpOnly` to that setup and expect a browser client to keep working.

Instantiate provider clients per request. Verify provider identity using the supported trusted Auth API before protected operations. A token decoded without signature verification is not identity. Distinguish local JWT validity from provider session revocation. Strict write and administration paths must check current provider session validity, with the chosen API tested against actual revocation behavior. An authentication outage fails protected operations without reporting a save.

Serialize refresh against a vault row or durable lease with a version check. An in-memory mutex on one Vercel instance cannot protect refreshes across instances. The second request reuses the refreshed token from the vault instead of refreshing the old token again. Never send either token in frontend responses. Vault access uses separate server-only credentials and has no public Data API grants.

OAuth starts through a same-origin POST with CSRF protection. Use PKCE, a short-lived flow-specific server record, one-use state, approved callbacks and fixed same-origin return paths. Bind the callback to its initiating browser. Require the selected SDK flow to prove state and verifier behavior during implementation. Email confirmation and recovery also use one-use provider tokens and an explicit callback contract. Never accept a supplied arbitrary redirect URL.

Every mutation, including login, signup, recovery and logout, checks exact trusted Origin, supported content type and method. Use a random synchronizer CSRF token bound to a short-lived pre-login session or logged-in session, sent through a custom request header. Check Fetch Metadata as additional defense. Missing Origin handling must be deliberate for legitimate clients, never a silent bypass. OAuth callbacks use their own state and PKCE validation instead of a POST CSRF header. GET routes never modify shop data.

All authentication and shop API responses use `Cache-Control: private, no-store`. Never cache `Set-Cookie`, provider tokens or account-specific responses at the CDN. Add route-specific CSP, frame protections, referrer policy and safe rendering. HttpOnly restricts token theft by scripts but an XSS payload can still operate the current session. Test both threats.

Password fields remain transient. Trim email edges only. No passwords, tokens or raw recovery payloads in telemetry. Use separate signup and sign-in paths, generic recovery/credential responses, provider-enforced limits plus durable backend throttles, and no public account-existence endpoint. Set new-password rules only after checking the actual provider configuration. Plain client validation is usability feedback.

## Relational transaction boundary

The proposed database holds shops, memberships, products, variants, bills, bill lines, reservations, reservation lines, returns, return lines, movements and command receipts. Every shop record carries `shop_id`. Composite foreign keys include `shop_id` so a bill line cannot reference another shop's variant. Preserve historical bill-line descriptions and prices. Numeric constraints mirror safe integer rules and available-stock rules.

Use a dedicated transaction-capable Postgres connection for the Node command executor. Use the pooler mode and driver settings verified against current Supabase connection guidance. Application connections must use a constrained role without `BYPASSRLS` or table ownership. The session vault uses a separate credential and module. Never use a service-role client as the ordinary shop writer.

Within each database transaction, install only the verified account claims in transaction-local context and use an authorized constrained role for RLS. Never derive claims from request JSON. The exact role grants and context setup need adversarial database tests before acceptance. Transaction pooling requires all request context to use `SET LOCAL` equivalents inside that transaction, with no session state assumed after release.

Initially serialize writes per shop using a locked shop row. That matches the existing whole-shop revision contract and is simpler to verify than fine-grained locking. For this single-owner MVP it trades per-shop write throughput for a clear correctness boundary. Each transaction does the following in a fixed order.

1. Verify current account membership and lock the shop row.
2. Read the command receipt by `(shop_id, command_id)`. Return its recorded result for the same canonical payload digest before checking a stale revision. Reject the same ID with a different digest.
3. Load the trusted current relational state. Check the submitted expected shop revision and entity version where required. Do not trust client stock totals or bill numbers.
4. Parse the external command into its exact allowed shape. Run the existing domain rules server-side against trusted data and a server clock. Create new numbers from a locked shop counter. Preserve the UI preview semantics.
5. Persist the resulting relational changes, stock changes, bill snapshots, reservation status, return links, movements, command receipt and qualifying usage event in the same transaction.
6. Commit, then return authoritative state and revision. On a lost response the browser reconciles the stable command ID. It does not make a new ID or repeat an unknown sale.

Use a receipt uniqueness constraint even with the shop lock. Failed validation rolls back and cannot count as activity. Unexpected database errors become a safe error code, with details only in restricted logs. A timeout is an unknown outcome until reconciliation proves commit or non-commit. Do not acknowledge a receipt before the transaction commits.

`execute` can provide the first trusted domain implementation after adding a clock dependency and deterministic bill-number input. Relational writes occur inside its transaction adapter. Avoid a second SQL rules engine that silently differs from the TypeScript rules. Once data size makes whole-shop materialization expensive, measure before changing the transaction granularity.

## Photos, import and presenter data

Product images live in a private bucket under server-created shop paths. The backend authorizes a product before generating short-lived read or upload grants. The browser cannot supply another shop prefix. Validate size, decoded image type and dimensions, and reject active content. Never store durable signed URLs as product records. Screens resolve images through a media adapter so persisted bill snapshots and PNG rendering keep their existing appearance.

Object upload and Postgres commit are not one distributed transaction. Stage uploads under an import or command ID, validate them, then commit references. Failed database writes leave recoverable staged objects. A separate scoped cleanup handles expired orphaned uploads after an explicit retention policy. Missing images must prevent a falsely complete backup or import report.

Import previews read the original local graph without changing `micro-erp-v1`. Reuse and strengthen the legacy graph validator on the server, validate all IDs and links, produce a digest and destination-bound preview, and require an empty owned shop. Commit entities, original numbers, dates, command history and an import receipt in one transaction after photo preparation. Preserve original bytes in a downloadable legacy backup. No implicit merge, overwrite on login or local deletion.

The private presenter account signs in normally and belongs only to a server-classified demo shop. Seed fictional deterministic data. Reset only after an authorized confirmation and a current database check of the demo cohort. No account in a frontend fixture, password in a seed file or public demo-login bypass. A reset changes a shop generation so stale handles cannot submit old commands after reset.

## Usage evidence

Count distinct verified real-cohort accounts, successful sign-ins and committed meaningful actions separately. Ingest provider success events through a restricted backend integration or verified auth audit source. Establish deduplication and retention after examining actual staging events. SDK session refresh, page reload, a failed sign-in and duplicate callback must not count as a new sign-in.

Record qualifying activity in the business transaction. Assign demo, team and test cohorts on the server. Imports do not qualify as fresh product or sales activity. The report has an explicit date window, Asia/Bangkok date boundaries, generation time, metric definitions and excluded cohorts. Admin permission comes from a private server-controlled allowlist, not user-editable metadata. Presenter credentials cannot read reports. A login proves account access, not demand or a unique person.

## Alternative and recommendation

A browser Supabase client with bearer sessions and transactional RPC requires fewer custom server modules and fits Vite directly. It places token access in the browser and makes SQL functions the trusted command executor. Every write function, table grant and Storage policy becomes a public API security boundary. It also risks maintaining business rules twice if the current TypeScript engine remains authoritative.

Candidate B keeps provider tokens outside browser JavaScript and can reuse trusted TypeScript rules. Its cost is a durable session vault, refresh coordination, CSRF protection, a Node backend and privileged database-connection management. Select it if keeping tokens out of browser JavaScript and keeping one TypeScript rules engine justify those operational costs. Do not describe it as inherently secure or simpler overall. A prototype approval does not settle this architecture choice.

## Verification after prototype approval

1. Run existing typecheck, lint, domain and browser flows before replacing persistence. Freeze paper and PNG fixtures with identical time, font and images.
2. Locally test command parity for all twelve variants. Run same-ID same-payload retry, changed-payload rejection, stale edits and reservation/return combinations.
3. On isolated staging, authenticate two accounts and use crafted HTTP and direct database API calls to try cross-shop reads, writes, foreign keys, media paths and admin reports.
4. Race two devices for the last pack. Drop the response after commit and verify one bill, one movement and one usage event. Test simultaneous token refreshes across backend instances.
5. Test actual Google callback, cancellation, email confirmation, recovery, provider rate limits, logout and session revocation. Probe CSRF, redirects, caching and stored text rendering. Mock responses do not prove these controls.
6. Rehearse legacy imports with embedded photos, historical bills, retries and partial object-upload failure. Reopen on a second device. Prove local data remains unchanged and bill pixels match.
7. Seed known activity and excluded cohorts. Compare report counts against the source records and verify timezone boundaries.

All these checks remain NOT VERIFIED at this stage. Infrastructure setup requires a separate staging Supabase project, Google provider configuration, email delivery and server-only environment settings. The operator enters secrets in the service dashboard or local ignored environment files, never in chat.

## Source check on 18 October 2026

Read the official Supabase skills installed in `.agents/skills/supabase` and `.agents/skills/supabase-postgres-best-practices`, plus the RLS and consistent-lock-order references. Current [server-side advanced guidance](https://supabase.com/docs/guides/auth/server-side/advanced-guide) distinguishes ordinary browser-accessible session cookies from this proposed dedicated backend session design. Current [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security) explains database-enforced ownership restrictions. The changelog Markdown URL was attempted but the web reader rejected its content type. This sketch does not assert that a changelog compatibility audit or implementation security audit has passed.