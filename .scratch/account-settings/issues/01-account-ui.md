# Show account email and secure password reset in Settings

Status: done
Blocked by: none

## Acceptance

Auth signed-in actions have explicit spacing. Cloud Settings has an account category, real email and password reset email action. Local demo Settings stays unchanged. Errors are safe, repeated clicks blocked, Thai/English supported. The loading issue was withdrawn by the user and is not changed.

## Comments

18 October2026: use existing recovery endpoint and verified reset flow rather than introducing a session-only direct password change form. Current Auth session branch lacks the action grid used by other screens, explaining adjacent buttons in the supplied screenshot.

Implemented shared12px Auth action grid and cloud-only account settings with authenticated read-only email, pending/accepted/error/rate-limit states and Thai/English. Client checks current session before and after obtaining bootstrap CSRF, never accepts an editable target email from Settings, and closes old account UI if identity changes. Reset remains existing verified email-link flow with four password rules, not a direct password write from Settings. No loading change because user withdrew that bug.

Verification: new account-action tests failed before implementation and passed after; all95unit/HTTP tests pass, typecheck via build and lint pass. Browser uses real provider sign-in, then intercepts recover request only to assert target email, CSRF, disabled pending state and exactly one request; this does not prove email delivery. Auth button geometry has >=11.5px gap, cloud account settings screenshots390/1440 pass visual review and no overflow. Three selected original browser regressions pass (language, Settings navigation, exact bill PNG parity). Extended320px/English account check recorded in latest outputs/inventory-staging/live-verification.json. No domain, schema, landing, local demo or production changes.

Impeccable context and detector used. Detector flags existing Plus Jakarta font declaration and brand gradient in global CSS; neither is introduced here, and the explicitly approved Khonnai logo gradient is retained. Existing Impeccable sidecar is stale relative to DESIGN.md; current DESIGN.md governs this refinement, with no sidecar rewrite or unrelated redesign.
