# Khonnai: Supabase, login and evidence of use

18 October 2026. Proposed design for review, not an implemented backend or a completed security audit. Landing composition remains approved. No account, database, credentials or production data was created during this investigation.

Throughput checkpoint: n/a, read-only investigation.

## Confirmed current implementation

- `src/data/storage.ts:4` stores one complete shop state in localStorage under `micro-erp-v1`. `load`, `parseBackup` and `commit` handle reading, validation and saving.
- `src/App.tsx:69` dispatches commands through `act`; mutation success follows persistence. Restore also writes localStorage directly and must migrate with normal saves.
- `src/domain/inventory.ts:10` contains products, variants, bills, reservations, returns, movements, command IDs, revision and shop details. It has no account identity or shop membership.
- `execute` already encodes reservation availability, return/exchange rules, bill versions and command deduplication. These rules are the migration contract. Web Locks and storage events coordinate local tabs, not different devices.
- Photos are embedded data URLs. Backup validation currently limits the entire serialized state to about 4.5 MB. Moving photos online requires a new export/import format while retaining legacy import.
- The current package manifest has no Supabase client. `/` redirects to the public landing locally; the existing app entry is `/app`. Deployment status is a separate concern.

## Proposed experience

Public landing → start CTA → login → own shop → existing operational screens.

Keep the current React/Vite app and design system. No framework rewrite. Initial scope is one owned shop per real account; membership records provide isolation without adding staff management or a shop switcher to the UI.

Proposed routes:

| Route | Purpose |
|---|---|
| `/landing/`, `/en/landing/` | Public marketing, no login required |
| `/login` | Choose Google or email; language switch remains available |
| `/signup` | Explicit email registration, separate from sign-in |
| `/auth/callback` | Complete provider/confirmation flow |
| `/auth/reset-password` | Complete verified password recovery |
| `/app` | Requires a valid session and membership of the requested shop |
| `/admin/usage` | Owner-only aggregate evidence report, no public customer directory |

Never trust a client-selected shop ID as authorization. On session expiry, retain unsaved form content safely for that account while prompting reauthentication; do not report a save as successful. On sign-out or account change, remove the previous account's cached shop state and pending queries before rendering the next shop. Reauthentication must not replay a transaction under another account.

### Login visual reference supplied by the user

Use the three Fastwork screenshots as composition references: existing Khonnai logo above, compact white card near the center, clear heading, stacked capsule actions, and email/password steps with a Back button. Do not copy the email visible in the reference.

- White/very light neutral canvas; navy `#193b5a` and orange `#ed7c32` blurred light behind the card. Keep the form itself opaque white and text high contrast.
- Existing Noto Sans/Noto Sans Thai and existing brand mark. Approximate card width 400px with mobile gutters, 16px radius, 52px controls. Decorative light must not capture input or cause overflow.
- Prefer a static glow; any optional slow movement stops under reduced motion. Step changes may use a short opacity/vertical transition without delaying submission.
- Primary entry: “เข้าสู่ระบบด้วย Google” / “Continue with Google”. Secondary: “ใช้อีเมล” / “Continue with email”. Facebook and Apple are outside the initial scope, even though the reference shows them.
- Email step checks syntax only. Continue always reaches the same password sign-in step; do not query whether the account exists to choose between sign-in and signup. A separate “สร้างบัญชี” link handles registration.
- Include visible labels, show/hide password with an accessible name, forgotten-password link, pending state and retry states. No placeholder-only labels, simulated successful login, or dead Terms/Privacy links.
- Design TH/EN plus loading, invalid fields, incorrect credentials, unconfirmed email, expired recovery link, provider cancellation, offline and rate-limit states. Keep server responses generic where necessary to avoid disclosing account existence.

## Authentication and validation

Recommended initial methods are Google OAuth and verified email/password. Password recovery is part of the first release, not a later feature. Supabase supports both methods; production email requires configured delivery and verified callback URLs. See [Supabase Auth](https://supabase.com/docs/guides/auth), [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [password auth](https://supabase.com/docs/guides/auth/passwords) and [SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

Client validation helps correction. The authentication service and server enforce the actual rules. Proposed acceptance requirements, guided by [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) and [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html):

- Trim surrounding email whitespace; allow ordinary valid addresses including `+` aliases. Do not claim syntax proves ownership; require email verification. Do not alter or trim passwords.
- Latest explicit user selection on18 October2026 supersedes the earlier proposed15-character policy: new passwords must contain at least8 Unicode code points, at least one ASCII letter A–Z/a–z, and at least one ASCII digit0–9. The confirmation must match exactly, making four visible checks. Configure and verify the same accepted policy on the trusted Auth side before integration; the prototype is client feedback only. Existing sign-in should not apply new-password creation rules.
- Allow paste, autofill and password managers. Use appropriate email/current-password/new-password autocomplete. Show correction beside the field on blur or submit, associate it with the input, and focus the first invalid field. Do not show errors before a field has been touched.
- Use generic credential/recovery responses across account states and inspect the network responses and timing, not just the text. Never expose a public account-existence endpoint. Verify signup behavior against actual Supabase configuration.
- Server-enforced throttling, provider rate limits and abuse controls apply to login, signup, resend and recovery. Client button disabling alone is not protection. Decide CAPTCHA thresholds from abuse behavior; do not send a password through telemetry.
- Password hashing and recovery belong to Supabase Auth. Do not store plaintext passwords in app tables, browser state persistence, logs or seed files.

Verify session identity on the trusted side for every protected operation. Treat client session state as UI state, not proof of access. Restrict callback/return destinations to approved same-origin paths, use the supported OAuth/PKCE flow, and never redirect to arbitrary user-supplied URLs. Evaluate session storage and XSS/CSRF controls together before implementation; an HttpOnly-cookie backend requires CSRF protection, while a browser-managed bearer session requires particular care against XSS. Do not assert either setup is automatically secure.

Only public/publishable credentials may enter the frontend bundle. Secret/service-role credentials remain server-side. Enable row-level security and least-privilege grants on exposed tables; private product images need matching Storage policies. See [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) and [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).

## Data model and transactional behavior

Foundational Thinking changes the starting point: define account → membership → shop before replacing persistence. Shop ownership is not the same as a user profile.

| Proposed record | Purpose |
|---|---|
| Supabase Auth user | Identity and authentication |
| `profiles` | Display settings; no passwords or self-editable admin flag |
| `shops`, `shop_members` | Shop identity and authorized account membership |
| `products`, `variants` | Shop catalog and stock units |
| `bills`, `bill_lines` | Saved sale snapshots, status and version |
| `reservations`, `reservation_lines` | Reserved stock and conversion state |
| `returns`, `return_lines` | Returns and replacement references |
| `movements`, `command_receipts` | Auditable changes and safe command retries |
| `usage_events`, server-controlled cohort records | Usage evidence with demo/test/admin exclusion |
| Private Storage objects | Product photos owned by a shop |

Every shop-owned record carries a shop identity. Foreign keys and constraints must prevent cross-shop references, including bill lines referencing another shop's variant. Cohorts and membership privileges are controlled by trusted operations, not user-editable metadata.

| Storage option | Trade-off | Recommendation |
|---|---|---|
| One JSON snapshot per shop | Smaller initial rewrite; requires trusted command validation, atomic compare-and-set, and larger payload reads/writes | Useful for a short private prototype, but do not accept arbitrary client snapshots |
| Relational shop tables | More migration work; explicit constraints, tenant isolation and reporting | Recommended target for real external users |

Retain `State`/`Command` as the UI-facing contract where practical. An adapter reconstructs the state needed by the existing screens. Stock-changing commands execute on the trusted side, with the database transaction as the commit boundary. Supabase database functions can be invoked through RPC; function grants and ownership checks must be explicit. See [database functions](https://supabase.com/docs/guides/database/functions).

Required invariants:

- Sale, stock deduction, bill numbering and movement/event records commit together or roll back together. Editing/cancelling a bill, reservation conversion and return/exchange receive the same treatment.
- Lock or version-check the relevant rows. Two devices selling the last pack cannot both succeed. Client arithmetic is preview only.
- A command has a stable ID. Check prior receipt before rejecting a stale revision on retry; a lost response must return the committed result instead of duplicating a bill. Reusing an ID with a different payload must be rejected.
- Server timestamps and shop-scoped bill number allocation determine persisted records. Keep historical bill snapshots and existing numbering rules during import; do not silently renumber old bills.
- Do not show “บันทึกแล้ว” until commit is confirmed. Network timeout can mean an unknown outcome; reconcile by command ID before telling the user to retry.
- Initial release requires connectivity to commit. No silent fallback to local-only writes and no offline transaction queue in this scope.

Move product photos to private Storage, storing object paths rather than durable signed URLs. Export/import must package or otherwise preserve photo content and resolve it before rendering a bill image. Preserve paper bill/PNG appearance with identical fixture comparisons.

## Presenter demo account

Create one private presenter account attached only to a demo shop. Seed fictional clothing/underwear products, sizes, colors, pack quantities, bills, reservations and return examples using deterministic fixtures. No real customer data or real user's store copy.

Keep the presenter credentials out of Git, the public landing, JS bundles and shared reports. The presenter signs in normally; no secret query parameter or hardcoded password bypass. The account is not a project admin.

An authorized reset restores only the demo shop, with a confirmation and a guard that verifies its server-controlled demo classification. Never reset automatically while a presentation or another session is active. A seed/reset rehearsal happens before presentation. All this account's actions remain available for debugging but excluded from genuine-user metrics.

A public “try demo” would need a separate isolated sandbox per visitor. Do not publish the private account as a shared credential. That public mode is outside the first release.

## Evidence that can be defended in a presentation

Explain the Number changes the report: show distinct verified accounts and meaningful actions separately. A login proves account access, not a real shop, a unique human, customer demand or willingness to pay.

| Metric | Definition |
|---|---|
| Registered accounts | Verified real-cohort accounts created in the selected period |
| Accounts that signed in | Distinct real-cohort user IDs with a successful sign-in in the period |
| Active accounts | Distinct real-cohort user IDs with a qualifying server-committed product/stock/bill/reservation/return action |
| Activated shops | Distinct real shops that completed the explicitly selected first-value milestone, proposed as creating a product and recording a sale |
| Returning active accounts | Accounts with qualifying activity on at least two separate reporting dates; state the timezone and window |

Use a visible date range and Asia/Bangkok reporting dates; persist event timestamps consistently. Count distinct user IDs for accounts and distinct shop IDs for shops. Never add them together. Product actions should be derived from committed operations, not an arbitrary client “purchase completed” event.

[Supabase Auth audit logs](https://supabase.com/docs/guides/auth/audit-logs) include authentication events and optional database storage. During implementation, verify what the project records for successful login versus attempts, confirmation and refresh before writing the aggregation. Enable/query the appropriate source and define retention/export. Do not count every `SIGNED_IN` SDK callback, refresh, page reload or raw audit row as a new login.

An owner-only report can start as a small date-filtered summary and CSV export with definitions, source, generation time and excluded cohorts. No broad analytics dashboard is required. Avoid customer names, bill details, passwords or tokens in analytics. Restrict raw logs and full account details. Publish a truthful data-use/privacy notice before collecting real accounts.

## Move existing local data safely

1. Identify valid local data after sign-in, without uploading it automatically or attributing it to a demo account.
2. Offer “นำข้อมูลจากเครื่องนี้เข้าร้านของคุณ” with a preview of the destination shop and entity counts. Keep the original and export a backup before import.
3. Validate the entire legacy graph, prepare photo objects, then commit the import once using an import ID. Retrying returns the original import result.
4. Initially allow import only into an empty owned shop. An existing remote shop requires a separately designed merge, not overwrite-by-login.
5. Verify counts, bill totals, reserved/available quantities and photos. Reopen on another device and verify the same data before marking migration complete.
6. Keep a migration receipt. Remove local data only through a separately authorized action. Namespace any future cache by account/shop and clear it on account change.

There is no need to eliminate all localStorage: language preference or an SDK-managed session may still use it according to the chosen session design. Shop business records become authoritative in Supabase.

## Delivery order and acceptance gates

1. Approve architecture, login screens and metric definitions. Confirm provider setup, Supabase project/region and email delivery. No public deployment at this point.
2. Implement identity, shop isolation, private photos and security tests with two accounts. Verify that UI bypass, crafted API calls and cross-shop IDs are denied.
3. Migrate commands with transactional integrity and legacy behavior parity. Test two-device stock races, timeout after commit, retry deduplication and old bill edits. Keep receipt/PNG golden fixtures unchanged.
4. Add controlled local import and demo seed/reset. Verify migration retries and that demo credentials cannot access real shops or usage administration.
5. Add usage report. Seed known events and prove refreshes, failures, duplicates, test/demo/admin and imports are handled exactly as defined. Test account isolation on shared devices.
6. Run typecheck, lint, unit tests, build, browser workflows, real RLS/API tests and provider/email flows in staging. A mock Supabase or a successful build does not prove authentication/security. Verify deployed redirects/callbacks separately before launch.

Landing layout stays unchanged. At cloud release, update only factual claims such as “ข้อมูลบนเครื่องนี้” and manual-only backup copy that would otherwise contradict the implemented storage behavior. Do not claim cloud backup, offline support or adoption figures before verification.

## Skills to use

| Skill | When and why |
|---|---|
| Poteto Mode + how | Investigation, scope and explanation grounded in the existing code |
| architect + codebase-design | Define the auth/persistence/command interfaces before implementation |
| domain-modeling | Establish user, shop, member, presenter and metric terms; record costly decisions only when settled |
| `supabase` | Official provider guidance for Auth, Storage, SDKs and configuration; additional installation recommended |
| `supabase-postgres-best-practices` | Official schema, RLS, functions and migration guidance; additional installation recommended |
| Impeccable + frontend-design/premium | Login composition, branded glow, responsive behavior, focus and error states |
| tdd + existing Playwright | Transaction, isolation, migration and authentication regression coverage |
| code-review | Review both requirements and project standards; security cases must be explicitly included |

The two official Supabase skills are documented in the [Supabase skills catalog](https://supabase.com/docs/guides/ai-tools/ai-skills) and their manifests are published in [supabase/agent-skills](https://github.com/supabase/agent-skills/tree/main/skills). They were inspected as recommendations, not installed or executed in this investigation. Skill use does not replace API/RLS tests or a security review.

Suggested later installation commands:

```powershell
npx.cmd skills add supabase/agent-skills --skill supabase
npx.cmd skills add supabase/agent-skills --skill supabase-postgres-best-practices
```

No keys, project access or passwords are needed to review this proposal. Infrastructure setup and implementation are the next task after scope selection.

## Visual approval on18 October2026

The user selected edge-only navy/orange glow, approved separate signup email and password screens with four checks, and authorized implementation. The prototype review gate is complete. Continue local/staging work without asking for the same approval again. No production deployment or deletion of existing local data is authorized. Staging credentials/provider configuration must use secure local/service settings, not chat.
