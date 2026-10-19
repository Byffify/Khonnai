# Auth launch readiness

18 October2026. Target branch: `authentication-feature`. This is a local/staging implementation, not a production release or an external security audit. Do not merge to main or treat a branch preview as a deployed Auth backend.

## Decision

Ready for internal testing with configured team accounts on the local staging server. Not ready for public self-service signup or real-shop launch on the Vercel URL.

## Implemented and verified scope

Email signup/login, separate password setup with confirmation and four live checks, provider-backed session verification, logout/revocation, verified reset callbacks, encrypted server-side provider tokens, opaque HttpOnly session cookies, CSRF and durable throttles are implemented. Account Settings displays the signed-in email and initiates the existing verified-email password reset flow.

Cloud shops are account-isolated using private RLS tables and server-side transactional domain commands. Local demo data is not imported or deleted. The operational flow and approved bill/PNG renderer remain intact.

Latest local unit/HTTP95/95, lint and typecheck were rerun before preparing this branch. The latest build passed in the account-settings delivery. Browser evidence covers actual provider login, account shop persistence and isolation boundaries, safe retry after response loss/Auth outage, mobile/desktop Settings and exact bill PNG parity. The account-settings recover request was intercepted to inspect its payload and duplicate-click protection, so that check does not prove email delivery. Earlier real recovery-token fixtures verified the provider reset path but bypassed email transport. Owner reports successful account use; independent real-inbox confirmation and recovery acceptance remains open.

## Required before public launch

1. Deploy the BFF and frontend behind the intended HTTPS origin. `server/config.ts` currently permits only127.0.0.1:5293; the helper binds API5294 to loopback. `vercel.json` does not configure Auth/cloud routes or an API server. A Git push alone cannot make this backend usable publicly.
2. Implement and verify production configuration: external environment/secrets, Secure `__Host-` session cookies, HTTPS-only origin checks, production CSP, redirects and callback URLs. Local Vite allowances are not production policy.
3. Configure email delivery for external users and test real inbox signup confirmation and forgotten-password flows end to end, including invalid/expired/reused links. Current owner choice was team-member/default email testing, not verified public SMTP.
4. Rehearse account isolation/session expiry, backups and recovery on the deployed staging environment before trusting real business records. Cloud backup export exists; cloud restore/private object Storage remain incomplete. Current complete-shop State limit is approximately4.5million characters, with relational graph rewrite per command.

Google is not required for email-only phase one. Private presenter/demo setup and genuine-user usage reporting are still separate unfinished scope. Staging accounts are classified as team and cannot be counted as real-user adoption. Client-to-pooler TLS is verified; the provider upstream database TLS observation remains unresolved and is not represented as fully verified transport.

## Branch contents and operation

Commit application/server code, tests, migrations, public CA, installed project skills, relevant Local Markdown plans and selected non-secret verification reports. Keep `.env.staging.local`, generated CLI cache, scratch diagnostic scripts, screenshots and local-only outputs out of this commit. No credentials are provided in Git or chat.

Run `npm.cmd ci`, populate the ignored local staging configuration using the setup guide, then `npm.cmd run auth:dev`. Existing migrations and runtime role provisioning must be checked against the target staging project; do not rerun empty-project fixtures against existing users. Follow [Auth guide](auth-staging-session-guide.md) and [inventory guide](inventory-staging-guide.md).

Push only `HEAD:authentication-feature`, set that branch's upstream explicitly, and never use an implicit push while its old upstream points to `origin/redesign`. No force push, main merge or production deployment is part of this delivery.
