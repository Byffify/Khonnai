# Fix Auth development startup re-entry

Status: done
Blocked by: none

## Acceptance

Repeat startup succeeds by reusing verified services. Free and foreign ports are distinguished. No unknown process is killed. Direct API bind errors are descriptive and secret-safe.

## Comments

18 October2026: reproduced exact npm error and confirmed this chat's helper owned5293/5294. The actual launcher regression .scratch/supabase-auth/verify-dev-reentry.mjs failed before the fix (exit1), then passed after restarting only the previously identified helper processes with the new markers. npm.cmd run auth:dev now exits0 with already-running URL. Real socket inspection test covers owned/foreign/free states. Fresh connections avoid stale keep-alive misclassification. Unit/HTTP60/60 pass; typecheck/lint pass. A fresh normal startup also reached both listening services. No database migrations, secrets, shop records, landing design or receipt files changed.
