# Animated brand loading state

Status: done
Blocked by: none

## Acceptance

New isolated main-based worktree and branch. Existing mascot/wordmark with subtle blue-orange loading motion, accessible Thai/English status without visible loading text, static reduced-motion state, no artificial loading delay. Real fallback uses the component. Auth checkout and shop data unchanged. Test temporary text merge compatibility, browser states and existing checks.

## Comments

18 October2026: main baseline18unit tests passed. Dependencies installed independently with npm ci. Only SiteEntry is a shared touched path; Auth data-loading integration is intentionally deferred until branch combination, documented rather than copied into main.

18 October2026: completed existing-brand mascot motion and static reduced-motion state. User requested removing visible loading text; status is now screen-reader-only. Real Suspense tests3/3 pass across320/390/768/1440, English, actual animated transforms and immediate ready-content replacement; local demo unchanged. Existing landing-entry/receipt browser regressions3/3 pass, baseline unit18/18 pass, typecheck/lint/build pass. Impeccable detector returned no findings. Temporary three-way SiteEntry rehearsal passes with Auth/cloud routes preserved, and authentication-feature remains03213cb. No actual branch merge, no cloud data-loading integration on main, and no production deployment. Preview is open separately on5295/loading-preview.html.
