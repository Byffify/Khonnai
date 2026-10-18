# Proposed implementation boundary after prototype approval

18 October 2026. Sketch, not an implemented security control or accepted production ADR.

## Decision

Use candidate B as the provisional base: a same-origin Node backend owns sessions and executes the existing TypeScript command rules against trusted relational state. The browser gets one account-bound shop capability and submits commands, not arbitrary row updates or client-calculated whole snapshots.

This choice preserves one trusted implementation of the stock, reservation, return/exchange and historical bill rules. It costs more operational work than browser-managed Auth plus RPC. In particular, the opaque HttpOnly session needs a private token vault, cross-instance refresh coordination and CSRF controls. HttpOnly alone does not prevent an injected script from acting as the user.

The alternative in `architecture-a.md` is viable only with carefully restricted command-function privileges and a tested SQL rules implementation. Do not combine the two into parallel writers. Candidate A's simpler Vite integration does not remove those requirements.

## Interface shape

Feature screens continue receiving `State` and async `act(Command)`. Opening a shop first resolves session and current membership. The opened capability captures the account and session generation. Outcomes are committed, rejected, conflict, signed-out, or unknown-until-reconciled. A result from an old account generation cannot update another account's screen.

An unknown result retains the original command ID. Reconciliation looks up the committed receipt before considering stale revisions. Same actor/ID/payload returns the same result; same ID with another payload is rejected. No remote failure enables a local-only writer.

## Additions from candidate A

- Distinct validated account/shop/command identifiers at request boundaries, with one versioned protocol definition.
- One coherent shop read snapshot, including stock and active reservations from the same revision.
- Receipt lookup before stale revision checks, with actor and canonical payload binding.
- Preserve historical text IDs and separate the remote photo decoder from the embedded-image legacy backup parser.
- Switch persistence authority in one unit. Retain local data solely as an explicit read-only import source.

## Conditions to prove before connecting real records

1. Finalize the actual session SDK/API, cookie settings, token vault and encryption/key handling, CSRF protocol, callback allowlist, one-use state and logout/revocation behavior. None is supplied by the mock form.
2. Define the restricted database role, grants, RLS and transaction-local verified identity. Demonstrate that pooled requests cannot inherit another account's context or bypass RLS.
3. Recheck membership inside the same shop-locked transaction that executes commands. Membership changes, imports and demo resets follow the same locking order.
4. Parse and size-limit network commands before execution. Refactor timestamps and bill allocation into trusted deterministic inputs while preserving existing behavior fixtures.
5. Prove one transactional sale and two-account isolation before broadening to all twelve command types. Then prove lost responses, last-pack races, stale versions and all return/reservation combinations.
6. Separate demo/test/team cohorts from real users in server-controlled records. Reports expose definitions and time windows, not fabricated adoption claims.

The current glossary's LINE wording does not authorize adding any LINE integration. No new workflow, staff UI or automatic import is part of this migration.

## Review and uncertainty

`architecture-review.md` compares both candidates. It is an independent agent review using the available model family, not a diverse-model security audit. Ordinal comparison scores are judgments, not measured protection levels.

The initial web reader could not fetch the Markdown changelog. The coordinator subsequently fetched the official Markdown directly and saved `.scratch/supabase-auth/supabase-changelog.md`. No SDK compatibility or end-to-end security conclusion follows from reading it. Verify pinned versions and relevant changes again when implementing.

The user explicitly requested review of the login prototype before real integration. This is the current gate. Staging configuration is a separate prerequisite; production deployment and deleting local records remain outside authorization.
