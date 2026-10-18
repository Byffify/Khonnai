# Staging session implementation

Status: done
Blocked by: none for this local session unit. Real email delivery and external settings remain prerequisites for the broader Auth release.

## Contract and throughput

Use approved architecture B. Provider tokens exist only in the BFF and encrypted database vault. Browser receives an opaque HttpOnly session cookie and a CSRF token in memory. Login, signup, recovery and reset are explicit routes. Auth landing stays independent of the existing local inventory until all cloud commands are ready. No cloud/local write fallback.

Parent owns HTTP boundary, local runtime provisioning, migrations, configuration, UI route and integration. Provider delegate owns provider/crypto/policy modules and tests. Session delegate owns session-store and its tests against the shared server/auth-contract.ts. Both use pointer-based contract and do not alter shared files. Dependencies: crypto and provider precede live session integration; runtime grant migration precedes DB tests. One owner applies migrations and edits local secret config.

## Checklist

- [x] Ground and compare architecture A/B in prior sketches; B selected.
- [x] Define provider and durable session interfaces.
- [x] Implement validated provider boundary, authenticated token envelope and session locking.
- [x] Provision scoped server credentials locally without exposing values.
- [x] Add same-origin HTTP routes, CSRF and durable auth attempt limits.
- [x] Port approved TH/EN auth UI and four password rules.
- [x] Test real session and database isolation, plus UI behavior. Report missing email/provider checks separately.

Do not deploy production, modify landing visuals, upload local shop data or alter paper bill/PNG.

## Verification18 October2026

Real provider login, opaque vault sessions, revoked-token rejection through remote /user, scoped runtime RLS, transaction context reset, two-instance refresh serialization, global local-session revocation after password change and durable throttling passed using generated synthetic confirmed fixtures. Fixtures cleaned up. Real browser login/reload/logout and an authenticated recovery callback passed, including reset reload, consumed-token rejection and session rotation. Recovery fixture uses provider one_time_tokens and bypasses email delivery only. TH/EN setup at320/390/768/1440 and reduced motion passed. Existing app browser33/33, unit/HTTP59/59, typecheck, lint and build passed.

Architecture adjustment: migration connection lacks auth schema grant option. Corrective migration20261018092721 removed attempted provider-table privileges. Current GoTrue /user middleware checks session existence, confirmed by live revoked-token test. No SECURITY DEFINER, privileged inherited role or direct auth.sessions query was added. Original migration20261018091742 remains immutable in history.

Independent review identified bootstrap/session CSRF mismatch; separate refs fixed it and real signed-in recovery test passed. After resuming the interrupted review, local logout during provider outage and reset-form reload were also fixed. Reviewer completed a focused source recheck and accepted both fixes; it did not independently rerun tests or provide a third-party security audit. Full email delivery, password configuration in provider, Google, cloud inventory, import, demo, usage reports and production release remain outside this completed unit.
