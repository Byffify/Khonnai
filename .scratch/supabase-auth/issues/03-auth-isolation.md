# Connect Auth and shop isolation

Status: needs-info
Blocked by: owner configuration of Auth URL/email templates and real team-member email delivery tests. Cloud release also needs full storage/API verification beyond this session unit.

## Acceptance
Cross-account RLS/API, recovery, callback and provider tests.

## Comments
Not yet complete. Dependent gates remain in force.

User approved the visual prototype and requested implementation on18 October2026. No further visual approval required. Staging project/access and provider configuration have not been supplied; do not claim a connected backend.

User supplied staging URL https://brwkigtdecywivcfijvq.supabase.co and confirmed empty project, Google and email delivery not configured. Prepared ignored .env.staging.local with URL and blank publishable key. No connection, schema write or security test performed.

18 October2026: user filled publishable key locally. `npm.cmd run auth:check` returned HTTP200: email enabled, signup enabled, confirmation required, Google disabled. Added repeatable read-only checker and nine fake-fetch tests. `npm.cmd test` passed27/27; lint, typecheck and build passed. All eight protected baseline hashes match. Browser tests were not rerun for this CLI/SQL source slice.

Prepared foundation migration and rollback SQL tests for private app/vault/control schemas and separate capability roles. Parent review removed shared-owner global default privilege changes to avoid affecting unrelated objects. SQL was NOT EXECUTED. No tables, accounts or sessions created. Migration database URL remains missing; local setup guide explains secure entry. Auth implementation, transactional commands, demo, usage reports and import remain incomplete.

18 October2026 continued: user supplied local migration URI. Pinned pg8.23.1 and Supabase CLI2.121.0 installed. Client TLS initially failed for missing CA; resolved with public CA URL verified from official Studio config, retaining certificate and hostname verification. Created CLI-generated migration20261018090754 (replaces provisional filename), passed real SQL/RLS fixtures in rolled-back staging transaction, applied via standard CLI migration history, and passed installed-schema SQL fixtures again. All synthetic accounts and temporary SET ROLE grants rolled back; zero auth users remain. Six foundation tables enforce RLS. Evidence: outputs/auth-staging/foundation-{dry-run,applied,installed-tests}.json. These checks do not cover a BFF, browser login or inventory writes. Database-observed TLS for pooler upstream is false; client-to-pooler TLS verified, no claim of all-hop TLS. User chose team-member email testing; SMTP/Google remain unconfigured. Full issue remains incomplete.

18 October2026 session unit: implemented local BFF, encrypted opaque cookie sessions, provider boundary, account provisioning under scoped app/control roles, durable throttles, same-origin CSRF, approved TH/EN UI and four password checks. Runtime migration20261018091742 and corrective migration20261018092721 recorded. No normal request uses migration credential. No provider auth-schema privilege needed: remote /user revocation enforced and proven live. Actual two-account Auth/RLS/refresh race/logout/password-change checks passed; generated fixtures cleaned up. Real browser login/reload/logout and signed-in recovery callback passed, using a synthetic provider one-time token to bypass delivery only. Screens320/390/768/1440, TH/EN, four green checks and reduced motion passed. Original browser33/33 passed, initial unit57/57/typecheck/lint/build passed; final test count58 after oversized-body case is verified separately. No cloud inventory writer, import, presenter data or real-user usage report is enabled. Original eight protected file hashes match.

Independent reviewer found bootstrap/session CSRF mismatch and it was fixed/proven with the real signed-in recovery flow. Review then stopped at usage limit; no completed independent-security-review claim. Owner guide docs/research/auth-staging-session-guide.md lists exact URL configuration, provider password policy and TokenHash email templates required before real team-member email tests. Do not claim email delivery or production readiness from synthetic fixtures.

Final focused source review resumed and completed after the quota reset. Two further findings fixed: logout now uses bootstrap CSRF and local revocation without requiring live remote authentication; password-reset reload resumes from an authenticated session after the one-time token is stripped/consumed. Reviewer rechecked both fixes read-only and found no remaining issue in those changes. Provider-outage logout HTTP regression passes. This is an inherited-model source review, not a comprehensive third-party security audit or independent rerun of tests.

Final verification: unit/HTTP59/59, typecheck, lint and build passed. Existing app browser33/33 passed. Latest live session + browser report passed including reset reload, opaque-session rotation, consumed-token replay rejection and invalid-email correction. Secret-exposure scan160text files found0local credential values in the scanned source/artifacts/build. All8protected baseline hashes unchanged. Only Auth helper processes were restarted, now running hidden on127.0.0.1:5293/5294; no production service was changed. Owner email setup is still required before marking the full issue done.

18 October2026 owner follow-up: user reports “ทำได้แล้ว” after instructions to open the connected Auth page and test their account. Record this as owner-reported success only; the message does not specify whether confirmation, reload, logout and password recovery all passed. Do not mark all email/recovery gates verified or change this issue to done from that statement. Next implementation unit is transactional cloud inventory in issue04 after closing the remaining Auth acceptance evidence. Local inventory, landing and original bill/PNG remain unchanged.
