# Architecture review before connection

Reviewed on 18 October 2026. This is an independent agent review on the inherited model family. Different-family models were unavailable. It is not diverse-model validation, an implemented security audit, or evidence that either architecture works.

## Recommendation

Use Candidate B as the provisional design base. Keep one trusted TypeScript command engine and one remote writer. Preserving the existing inventory, reservation, return, and historical bill rules is the deciding factor. Candidate A requires a second trusted implementation in SQL and differential coverage for every command. Neither candidate is accepted for real connection before the user reviews the login prototype.

B costs more to operate. It requires a durable session vault, refresh coordination, CSRF protection, a restricted database connection, and a deployed backend. Do not describe HttpOnly cookies as proof that B is secure. XSS can still issue authenticated requests.

## Rubric

Scores are ordinal reviewer judgments from 1 to 5. They are not measurements, security probabilities, or benchmark results. Higher means the written design addresses this project's constraint more directly. No total score substitutes for the unresolved implementation gates.

| Criterion | A | B | Reason |
| --- | --- | --- | --- |
| Server-enforced tenant and command integrity | 4 | 4 | Both specify shop-scoped constraints, one transaction, live membership checks, receipts, and shop locks. Neither has executable proof. |
| Preserve existing rules without silent duplication | 2 | 5 | A ports trusted rules to SQL. B can execute the existing TypeScript rules on trusted state with an explicit server clock. |
| Session, CSRF, XSS, RLS, and grant correctness | 3 | 3 | A accepts browser token theft and sensitive definer grants. B adds vault, cookie, CSRF, and connection-role failure modes. Both leave exact behavior unverified. |
| First-release operational complexity | 4 | 2 | A fits the current Vite client. B introduces backend operations and cross-instance refresh coordination. |
| Safe import, demo, usage evidence, and testability | 4 | 4 | Both preserve originals, separate cohorts, and specify controlled import. Required tests are proposals only. |

## Small additions from A

1. Keep distinct validated account, shop, and command identifiers at the boundary. Keep transport row shapes out of feature screens.
2. Require a coherent read snapshot. Separate REST reads must not assemble stock and reservations from different revisions.
3. Reconcile command receipts before rejecting a stale revision. Bind receipt reuse to actor and canonical payload, not only command ID.
4. Preserve arbitrary legacy identifiers. Do not route remote photo paths through the legacy parser that accepts embedded image data only.
5. Remove the active local writer in the same change that enables the cloud writer. Keep legacy storage as an explicit read-only import source. Never save locally after a remote timeout.

These additions do not introduce a parallel SQL command engine or a browser Supabase session into B.

## Conditions before implementing B

- Decide the exact session and provider APIs. Prove expiry, refresh, logout, and revocation with real provider sessions. A valid JWT or an untested identity lookup must not be called immediate session revocation.
- Specify database role creation, grants, RLS evaluation role, and transaction-local claims. Verify the connection cannot bypass RLS or retain another request's identity through the pool. No service-role normal writer.
- Make membership changes, imports, and demo resets use the same shop lock and lock order as commands. Recheck membership inside the locked transaction so a revoked member cannot rely on an earlier lookup.
- Define canonical payload hashing, stable command IDs, expected revision, entity versions, and reconciliation semantics in the wire protocol. Reject unknown fields and oversized payloads before domain execution.
- Test whether the current executor mutates inputs or allocates identifiers and timestamps implicitly. Add deterministic trusted inputs before using browser previews as parity fixtures.
- Write the exact callback contract for signup, confirmation, recovery, and OAuth. Use approved return paths, one-use flow state, and PKCE. Do not copy passwords into a session vault or telemetry.
- Show account email in the password step only because the user entered it. Separate sign-in and signup paths. Never branch publicly on whether the email exists.
- Resolve the glossary's LINE-specific reservation wording without reintroducing the removed LINE workflow.

These are implementation prerequisites. They are not findings against code that does not yet exist.

## Plan and staging guide review

The spec and plan preserve the user's visual gate. Independent architecture sketches and setup instructions can proceed. Real Auth, SQL, accounts, shop writes, and provider connections must wait for explicit prototype review. The staging guide correctly states this boundary and does not ask for secrets through chat.

At this review snapshot, `package.json` defines `auth:prototype`, but `.scratch/auth-prototype/server.mjs` does not exist. The staging guide's command and URL are therefore not yet verified. This can be concurrent work in progress. Run the finished script, open the real page, and record the result before presenting the command as working.

The issue files declare blockers, so later tasks cannot start despite `ready-for-agent` triage status. Keep those blockers visible in the handoff. Do not mark issue 02 complete solely because screenshots or browser checks exist. Its acceptance explicitly requires the user's review.

The spec describes prototype passwords as staying in input elements only. Verify that property in the finished prototype. A network-free mock form still needs to avoid persistent values, query strings, logs, fake account-success claims, and metadata requests that send entered values.

## Audit trail findings

The decision log currently has only two rows. It does not yet record architecture selection, the model-family limitation, the missing local database tools, the attempted changelog read, prototype verification, or later decisions. Append these with evidence as they happen. Do not backdate them.

The install row is marked VERIFIED at `2026-10-18T08:27:51.660Z`. The provenance labels `2026-10-18T08:29:28.359Z` as `installedAt`. The coordinator reports that installation actually preceded the decision log and that the later value is the provenance generation time. This is ambiguous metadata, not evidence of falsified chronology. Rename the later field to `capturedAt` and append the clarification without inventing an exact installation timestamp.

I independently compared all 40 installed skill files against the SHA-256 values in `skill-provenance.json`. All match. I also compared all eight files listed in `baseline.json`. All match at this review snapshot. These checks establish content consistency with the recorded snapshots. They do not prove remote repository provenance or unchanged files outside that list.

The provenance records a mutable `main` ref, versions, and local hashes. Record the exact upstream commit or immutable download identifier if recoverable. Do not invent one. The existing manifest alone cannot prove which upstream commit supplied those bytes.

## Verification boundary

No Auth, RLS, CSRF, cookie, transaction, race, import, media isolation, metric aggregation, or provider security test was implemented or executed in this review. No real database connection was made. The architecture candidates explicitly acknowledge the same gap.

The first unit after prototype approval is a two-account authorization test and one transactional sale path on isolated local or staging infrastructure. Follow it with direct API grant attacks, cross-shop references and media, last-pack races, lost-response reconciliation, token refresh races, imports, cohort reports, and unchanged bill and PNG fixtures. Existing app tests or prototype screenshots cannot substitute for these results.

Prove It Works shaped the hash checks and the refusal to infer security from design prose. Explain the Number shaped the separation between ordinal judgment scores and measured evidence.
