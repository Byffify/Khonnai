# Candidate A. Browser Auth with transactional database commands

Design sketch only, prepared 18 October 2026. No connection, migration, provider configuration, or security verification is part of this candidate. The TH/EN login prototype must be reviewed before connecting real authentication or shop records. This is an input to synthesis, not an accepted ADR.

## Grounded constraints

`src/App.tsx` currently boots through `load(localStorage)`, submits through `commit`, and updates screen state only after that operation succeeds. It serializes local writes with `navigator.locks` where available and refreshes from storage events. Those mechanisms do not protect two remote devices.

`src/data/storage.ts` validates version-1 graphs, checks the current revision, invokes `execute`, and writes `micro-erp-v1`. Its graph parser accepts only embedded JPEG/PNG/WebP photos and caps the serialized backup at 4.5 MB. A remote State containing signed image URLs cannot be passed through this legacy parser unchanged.

`src/domain/inventory.ts` owns `State`, the `Command` union, availability arithmetic, bill versions, reservation conversion, linked-return restrictions, and command IDs. Prices are integer minor currency units. Its local executor generates timestamps and bill numbers inside the browser. It currently treats any repeated command ID as a no-op without comparing payloads. The trusted implementation must strengthen that behavior.

The five existing screen groups consume State and asynchronous `act` behavior. This gives one useful persistence seam. Preserve screens and paper/PNG composition. Keep domain semantics and their test cases, but do not run the browser executor and then upload its resulting snapshot as proof of a valid transaction.

The glossary defines available stock as remaining stock minus active reservations. Its LINE-specific reservation definition conflicts with earlier scope removal. This candidate introduces no LINE workflow and leaves that vocabulary conflict for the coordinator to resolve. No `docs/adr/` directory exists in the checkout inspected.

## Usage first

Illustrative caller code, not an implementation:

```ts
const identity = await auth.restore()
if (identity.kind === 'signed-out') showLogin()
else {
  const shop = await shops.openOwnedShop()
  renderShop(shop.state)
  const command = buildSaleFromExistingForm()
  const outcome = await shop.submit(command)
  switch (outcome.kind) {
    case 'committed': renderShop(outcome.state); showSaved(); break
    case 'rejected': showCorrection(outcome.code); break
    case 'reauthenticate': preserveThisAccountsDraft(); showLogin(); break
    case 'unresolved': showCheckingStatus(); break
  }
}
```

`submit` owns safe retry and receipt lookup. A timeout is not a rejected sale. It does not return a generic failure that encourages the caller to generate another ID. The caller retains the same Command until a definitive result. If reauthentication changes account, close the old shop handle and do not replay its command under the new identity.

## Proposed interfaces

```ts
type Identity =
  | { kind: 'signed-out' }
  | { kind: 'signed-in'; account: AccountId }

type SubmitOutcome =
  | { kind: 'committed'; receipt: CommandReceipt; state: State }
  | { kind: 'rejected'; code: CommandRejection }
  | { kind: 'reauthenticate' }
  | { kind: 'unresolved'; commandId: CommandId }

interface ShopSession {
  readonly state: State
  submit(command: Command): Promise<SubmitOutcome>
  refresh(): Promise<State>
  close(): void
}

interface ShopAccess {
  openOwnedShop(): Promise<ShopSession>
}
```

`AccountId`, `ShopId`, `CommandId`, and receipt versions are distinct validated types in the eventual contract. Reuse the existing Command discriminant rather than exposing Supabase row types to screens. Derive the network command schema and rejection union from one protocol definition and fail CI if the SQL implementation lacks any command kind.

`ShopSession` hides shop selection, request parsing, immutable account binding, state assembly, receipt reconciliation, and photo resolution. It does not expose individual table writes or session tokens. A versioned `read_shop_state` RPC returns one coherent snapshot at a database snapshot boundary. Multiple unrelated REST reads could assemble incompatible stock and reservations.

## Module ownership

| Proposed module | Owned knowledge |
|---|---|
| `src/auth/` | Supabase Auth calls, callback allowlist, session lifecycle, login state |
| `src/data/remoteShop/` | Only browser Supabase data adapter, RPC parsing, account-bound cache, snapshot assembly |
| `src/data/legacyImport/` | Existing graph parser, user-approved preview, legacy identifiers, import manifest |
| `supabase/` | Later generated migrations, command functions, grants, RLS, database tests |
| Existing `src/domain/` | Operational vocabulary and client previews, not trusted authorization |
| Later trusted administration tooling | Demo seed/reset and usage aggregation, with separate authorization |

In cloud mode App has one writer, `ShopSession.submit`. Remove its local commit path in the same change that enables cloud writes. Legacy storage remains read-only for explicit import. Do not add fallback-to-local saving. A deployment feature flag can retain the untouched local build during development, but a single running session must not switch authorities after a network error.

## Request and authorization boundary

The browser uses Supabase Auth with a publishable key. OAuth uses the supported PKCE flow and approved same-origin return routes. Browser session state is UI state only. Supabase's trusted API verifies bearer token signature and expiry before populating the database request identity. Every command additionally resolves the current account and live membership from trusted database rows. Never accept a caller-supplied owner ID, role, cohort, or user-editable metadata as authorization.

Expose a narrow `api` schema of explicitly granted RPC entry points. Keep relational tables in a non-exposed schema. Deny direct browser INSERT, UPDATE, and DELETE on all business tables. An ordinary membership SELECT/INSERT policy alone cannot enforce that selling stock and issuing a bill happen together.

This command-only design has a deliberate privilege requirement. A `SECURITY INVOKER` function cannot write if its caller lacks table write grants. Do not fix that by granting arbitrary writes to `authenticated`. Use a small, audited private `SECURITY DEFINER` command helper, owned by a dedicated NOLOGIN role with only the required table privileges, no BYPASSRLS, and no ownership of the business tables. The exposed wrapper does not itself elevate privileges. Give the wrapper's authenticated caller only the minimum private schema/function access needed to invoke the helper. The helper still checks `auth.uid()` and live membership and runs under appropriate RLS. There is no role switching available to the browser.

All elevated helpers require a fixed safe search path, fully qualified object references, typed/strictly validated inputs, no caller-controlled dynamic SQL, explicit revocation of default PUBLIC execution, and grants only to the intended caller roles. New-function default privileges must also be locked down. Reject anonymous Supabase users if enabled, not merely unauthenticated requests. Review the exact deployed function ownership, policies and grants with API-level tests and Supabase advisors. This is a security-sensitive design obligation, not a verified control.

Read policies restrict each shop-owned row through live membership. Membership self-read must not recursively invoke its own policy. Provisioning one owned shop is a separate idempotent, verified-account operation. Browser users cannot promote memberships or assign metric cohorts. All cross-entity references include shop identity in their constraints so a shop-A line cannot reference shop-B stock.

## Relational data shape

Proposed shapes, not migration SQL:

- Auth accounts remain in managed Auth. Profiles contain display preferences only.
- Shops contain operational identity, revision and next bill number. Memberships pair account and shop with trusted roles.
- Products and variants carry shop identity. Quantities remain nonnegative whole packs. Prices remain nonnegative integer minor currency units, within JS-safe limits on both boundaries.
- Bills, bill lines, reservations, reservation lines, returns and return lines preserve the existing statuses, document snapshots and edit restrictions.
- Movements and command receipts record the committed result. A receipt key combines shop and command ID and records the actor, canonical payload digest, result identifiers and revision.
- Private photo paths identify objects. Cohorts and usage administration live in private trusted tables.
- Legacy entity IDs need not be UUIDs. Preserve them with shop-scoped text identifiers or a durable mapping. Never reject valid legacy backups solely because old IDs are not UUIDs.

Use unique shop/code rules matching current case-insensitive product behavior, composite foreign keys for tenancy, indexes for membership lookups and foreign keys, and server timestamps. A persisted bill line remains a historical snapshot when the product changes.

## One transaction per command

For the first release, serialize commands within each shop by locking its shop row. This matches the existing global revision behavior and avoids write skew between reservation and sale. Different shops remain independent. Membership changes, imports and demo resets take the same shop lock. Do not call Storage or email services while holding it.

Within the trusted command function:

1. Resolve verified identity, acquire the shop lock, and confirm live membership.
2. Validate command size, shape and allowed identifiers. Compute a canonical payload digest on the trusted side.
3. Find an existing receipt before rejecting stale revisions. The same actor and payload returns the original committed receipt. A reused ID with different payload or actor is rejected.
4. Validate required revision and bill versions. Recompute remaining and available quantities under the lock. Never trust a supplied stock total, document number or calculated amount.
5. Apply product/stock/document changes, allocate the bill number, append movement and qualifying usage event, increment revision and insert receipt in the same transaction.
6. Return the committed receipt and a consistent state snapshot, or roll everything back.

A concurrent identical retry waits on the lock and then observes the receipt. A timeout after commit reconciles through that same receipt. A later read may show a newer shop revision, but must not regenerate the old bill. Bound command size and transaction duration. If shop-level contention becomes material, replace it with consistent sorted row locking only after preserving the race-test suite.

Port every existing command rule, including duplicate line aggregation, bill cancellation after returns, return quantity limits, linked-bill price-only edits, reservation conversion and exchange. Database CHECK constraints and trusted code must cover safe integer arithmetic and limits. Porting to SQL duplicates some preview arithmetic, so shared fixtures and differential tests are a release requirement.

## Session, photos, import and metrics

A browser-managed bearer session accepts that malicious JavaScript can steal tokens. Avoid custom token copies, HTML injection and third-party scripts on authenticated pages. Use a restrictive CSP and test OAuth and photo sources against it. Clear account-bound snapshots, draft references, subscriptions and pending commands before rendering another account. Access tokens can remain valid after sign-out until expiry. If immediate revocation is required, sensitive RPCs must verify a still-valid session against the trusted session source; test sign-out and revocation timing rather than promise instantaneous invalidation.

Private Storage policies bind paths to live shop membership and validate object type/size. Product edits use uploaded objects already owned by that shop. Upload first, commit references second, and clean unused uploads later with a conservative trusted retention job. Image uploads cannot be made atomically part of a Postgres transaction. Receipt rendering resolves image bytes before canvas export and preserves CORS-safe output and the existing visual fixture.

Legacy import requires user confirmation of account and destination, an exported backup, a complete parsed graph and staged photos. A single import transaction checks the shop is empty, takes an import ID, preserves historical bill numbers and records a manifest. Retry returns that receipt. Original `micro-erp-v1` remains untouched. Imported history must not count as new qualifying actions.

Demo seed and reset are trusted administrative operations restricted to a server-classified demo shop. Presenter credentials never enter the client build. Reset verifies classification and confirmation and does not execute on login. Usage events derive from committed commands. Signed-in-account metrics derive from verified Auth audit semantics, not SDK callbacks or page reloads. Aggregate reports use trusted cohort exclusions and Asia/Bangkok date boundaries. They never query raw account directories from a normal user session.

## Tradeoffs and BFF alternative

Candidate A avoids a separate session server and fits the present React/Vite application. It puts durable transactional behavior close to relational constraints and permits direct tenant-protected reads. It accepts SQL command complexity, careful elevated-function auditing and browser token exposure.

A same-origin BFF with HttpOnly cookies hides refresh credentials from JavaScript, centralizes session controls and can keep command logic in TypeScript with a single database transaction. It adds a deployed server, callback/session coordination, CSRF protection, origin checks, cookie lifecycle and database connection management. XSS could still issue authorized requests even with HttpOnly cookies. Service-role access in the BFF would also require explicit tenant authorization or a restricted database role. Neither shape is automatically secure.

Prefer A if the team can maintain and test the SQL mutation boundary and accepts browser-managed sessions. Prefer the BFF if server-managed sessions or TypeScript transaction ownership outweigh the extra service. Do not ship both mutation paths.

## Required gates before staging claims

- First obtain the requested login-prototype review. The next implementation phase begins only after that gate.
- Verify exact Auth SDK and CLI versions against current official documentation. The changelog Markdown URL was attempted in this review but the browsing tool rejected its content type. No changelog compatibility conclusion is claimed.
- Prove two-account isolation for reads, RPCs, private photos, forged shop IDs, cross-shop references, direct writes and function grants.
- Prove two-device last-pack sale/reservation races, duplicate commands, changed-payload retries, rollback, stale edits and timeout after commit against a real local/staging Postgres instance.
- Verify real Google callback, email confirmation, password recovery, throttling, generic account-existence responses, token expiry, refresh and account switching. A form prototype proves none of these.
- Rehearse empty-shop legacy import, photos, historical numbers and repeat import. Compare existing bill and PNG fixtures unchanged.
- Seed known usage events and prove exclusions for demo, team, test, refresh, duplicate and import events. Demo credentials must fail usage administration and real-shop access.
- Run typecheck, lint, unit and browser suites plus real API/RLS tests. Record unexecuted external checks as NOT VERIFIED. Do not deploy production.

## Source basis

The local source files and research brief above were read in this review. Supabase documentation was consulted for [database function execution and permissions](https://supabase.com/docs/guides/database/functions), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), and [session behavior](https://supabase.com/docs/guides/auth/sessions). The command-only privilege shape, shop serialization and interfaces are proposed engineering decisions, not claims that Supabase supplies them automatically.

Foundational Thinking led to shop ownership and one authoritative command boundary before replacing storage. Boundary Discipline keeps untrusted row/token representations inside adapters and trusted functions. Make Operations Idempotent requires receipt reconciliation before stale-version rejection. Type System Discipline keeps account/shop identifiers distinct and unresolved outcomes explicit.

## Synthesis handoff

Candidate A is complete as a sketch. The coordinator must compare it with Candidate B and choose one session/transaction owner. The first implementation unit after prototype review is a real two-account isolation harness and one transactional sale command. No architecture code or SQL migration was produced here.
