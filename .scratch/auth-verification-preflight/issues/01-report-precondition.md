# Explain why live fixture verification cannot run

Status: done
Blocked by: none

## Acceptance

An occupied project stops before fixture creation, reports STAGING_NOT_EMPTY and not_run, and exits nonzero. The latest attempt is recorded separately; previous verification evidence stays intact. Tests cover empty/occupied guards and actual report file persistence. Existing real accounts remain untouched.

## Comments

18 October2026: read-only preflight found one account. Reproduced the original CLI failure: configuration / ERR_ASSERTION, no checks executed. The empty-project assertion directly explains the output; no broader hypothesis search is necessary.

Implemented an explicit empty-project precondition with NOT RUN / STAGING_NOT_EMPTY, passed:null and exit1. No fixture SQL is reached in this path. A separate latest-attempt artifact preserves prior verification bytes. Two regression tests cover guard behavior and actual file persistence; npm.cmd test passed62/62 and npm.cmd run lint passed. Live CLI returned the intended not_run report and exit1, and SHA256 comparison confirmed the previous verification file was unchanged. Read-only counts were1 before and2 after this work; the verifier stopped before generating fixtures, so no claim is made that the total account count stayed constant or about the origin of the additional account. No account deletion or mutation was performed by this verification path. Real email delivery and real-account login remain unverified in this turn.
