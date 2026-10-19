# Auth and shop database foundation

Foundation migration `20261018090754` was applied to the user-designated empty staging project on18 October2026 through pinned Supabase CLI2.121.0. SQL role/RLS assertions passed both before application and against the installed schema, with all fixtures rolled back. Reports are in `outputs/auth-staging/foundation-{dry-run,applied,installed-tests}.json`. This verifies the tested SQL policies only, not browser authentication or the unimplemented BFF.

`migrations/20261018090754_auth_foundation.sql` contains the foundation. Its filename was generated with `supabase migration new auth_foundation`; `db push` recorded it in standard migration history. It does not create inventory tables, import local data, change the application writer or create a presenter account. The CLI manages the migration transaction.

## Access model

The `khonnai_app`, `khonnai_vault` and `khonnai_control` schemas stay outside Supabase's exposed Data API schemas. The migration removes schema, table, sequence and function access for PUBLIC and the standard Data API roles. It creates no API functions or SECURITY DEFINER code.

Three NOLOGIN capability roles have no superuser, role-creation, ownership or RLS-bypass capability.

| Role | Capability |
| --- | --- |
| `khonnai_app_runtime` | Read the verified account's profile, shop and membership. Update only its display name, language and shop name. |
| `khonnai_vault_runtime` | Manage opaque sessions. Cannot read business or cohort records. |
| `khonnai_control_runtime` | Manage server-owned account cohorts and report-administrator records. Cannot read business rows or sessions. |

No role can create shops or memberships at runtime yet. Trusted first-account provisioning needs a separate reviewed implementation and tests. Ordinary accounts cannot create memberships, reassign owners or promote themselves to report administrator. The composite membership foreign key permits only the shop's owner in this initial single-owner release. Profiles reference the stable primary key in `auth.users`. The migration does not store passwords or copy user-editable Auth metadata into authorization records.

## Transaction identity boundary

The future trusted BFF verifies the provider session before opening a business transaction. It installs the verified UUID with `select set_config('khonnai.user_id', $1, true)` inside that transaction, using a constrained server-only database login. The value never comes from request JSON. A missing identity sees no business records. Malformed UUID context fails rather than granting access.

Custom PostgreSQL settings are not authentication. Any holder of the application database credential can set this identity. Keep the credential outside browsers, constrain SQL to parameterized server code, and do not expose general-purpose query endpoints. RLS adds a tenant boundary inside this trusted execution model. It does not defend against a fully compromised trusted BFF. Never reuse a session-level setting across pooled requests. Real pooled transaction-reset tests remain required.

Login provisioning, role membership grants and passwords are deferred. The migration fails if any named capability role or private schema already exists. Inspect that state instead of altering or adopting it automatically. No role gets ownership or membership in another capability role. PostgreSQL's global default EXECUTE grant to PUBLIC cannot be canceled by a schema-local revoke. This draft leaves the shared migration owner's global defaults unchanged to avoid affecting unrelated Supabase objects. It creates no functions, revokes existing function access in the private schemas and denies Data API roles schema usage. Every future function needs an explicit PUBLIC EXECUTE revoke before its intended grants. Future objects created by a different owner also need their own privilege configuration.

## Session vault boundary

`sessions` stores 32-byte session and CSRF hashes, an authenticated-encryption ciphertext envelope, a key identifier, provider session identity, absolute and provider-token expiry, revocation time and refresh version. `token_ciphertext` contains encrypted token bytes, never plaintext token JSON. Its length constraint is structural validation only. It cannot prove encryption. The server must implement a versioned AEAD envelope with a fresh nonce, keep encryption keys outside the database, bind associated data to the session and user, and test key rotation and tamper rejection before storing real tokens.

Refresh version alone does not serialize concurrent refreshes. The future backend must lock the session row inside a transaction and use a compare-and-swap version check. Expiry, revocation and provider-session validity checks belong to that backend and are not implemented by this schema. The vault role intentionally sees all sessions for server verification. Do not grant it to an end-user connection.

## Isolated database verification

`tests/auth_foundation.sql` is a psql script with `ON_ERROR_STOP`, assertions and a final rollback. It requires an isolated disposable Supabase-compatible database with `auth.users`, and a test connection with BYPASSRLS or superuser plus the privilege to insert synthetic Auth fixtures and SET ROLE. FORCE RLS blocks fixture insertion by a mere table owner without those capabilities. The test checks this prerequisite before inserting records. It does not call Auth APIs or send email. It must not run against production. Existing fixture UUIDs cause a hard failure instead of overwriting records.

After independently confirming the target is disposable, set `khonnai.test_database=isolated` on the test connection. Run the migration there, then run the test through psql with `-v ON_ERROR_STOP=1 -f supabase/tests/auth_foundation.sql`. Supply connection details through the local secret environment or password prompt. Do not paste them into chat or commit them.

The script checks two-account visibility, missing identity, own updates, denied cross-shop updates, immutable ownership, owner-only membership constraints, denied membership writes, denied self-promotion, vault and control separation, RLS configuration and standard Data API role privileges. It does not prove browser Auth, real token encryption, pooling isolation, provider revocation, callback validation or resistance to SQL injection. Run actual concurrent refresh and pooled-request tests when those modules exist.

The source represents account, owner membership, session secrets and reporting privileges as separate constrained records. Reference checks used [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security) and [PostgreSQL privileges](https://www.postgresql.org/docs/current/ddl-priv.html). The official changelog was fetched directly and saved under `.scratch/supabase-auth/`. The reviewed PostgreSQL minor-release changes concern extensions/operators not used by this migration.

## Repeatable staging checks

- `npm.cmd run auth:db:check`: read-only connection and capability report.
- `npm.cmd run auth:db:test:foundation`: run fixtures against installed foundation in the still-empty staging project, then roll back. Refuses to run once real accounts exist. Temporary grants to the migration connection permit SET ROLE and are rolled back too.
- `npm.cmd run auth:db:migrate`: guarded foundation-only CLI wrapper. Requires matching successful dry-run evidence and an empty account set. This is not a general migration runner. CLI output is withheld because errors may contain connection credentials.

The public CA in `certs/prod-ca-2021.crt` came from the URL configured in [Supabase Studio's official source](https://github.com/supabase/supabase/blob/master/apps/studio/hooks/custom-content/custom-content.json): `https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt`. SHA256 of the downloaded PEM is `700723581420dd1ac98fd7e9ac529f0ef210eadcaf87fc868a3ad7d114c2f3b7`. Client TLS verifies both certificate and hostname. No `rejectUnauthorized:false` fallback is permitted.

The SQL `pg_stat_ssl` preflight reported `false` for the pooler-to-database connection while the client-to-pooler TLS was verified. These are different hops. Do not describe this result as end-to-end verified TLS. Confirm upstream transport/enforcement with the provider before sensitive real data is connected. No enforcement setting or reboot was triggered by these scripts.

## Session runtime extensions18 October2026

Migration20261018091742 adds verified single-owner onboarding INSERT policies and durable hashed auth-attempt counters. Migration20261018092721 revokes the attempted Auth-schema read grant: the migration owner cannot delegate schema usage there, and the provider's remote `/user` endpoint already checks revoked session IDs. Live verification proved rejection after provider logout. Historical migrations stay immutable. The sections above describe the original foundation's grants; current runtime extensions supersede the onboarding deferral.

The BFF uses three distinct INHERIT LOGIN roles, each inheriting only its matching NOLOGIN capability. Generated passwords and AES/HMAC keys stay in ignored local configuration. Real runtime checks proved they have no superuser, BYPASSRLS, CREATEROLE or CREATEDB attribute, cannot cross the app/vault/control boundary and cannot retain a previous transaction's account setting. All staging-created accounts are classified as team, never real-user adoption.

`scripts/verify-auth-runtime.mjs --browser` passed real provider login, encrypted sessions, provider revocation, two-instance row-locked refresh, password invalidation, RLS and browser flows using generated disposable fixtures. It does not test actual email delivery or cloud inventory. Setup details and remaining gates are in `docs/research/auth-staging-session-guide.md`.
