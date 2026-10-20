# Connect approved loading presentation
Status: done
Blocked by: none

## Comments
Implemented presentation-only replacement of SiteEntry fallback and CloudApp loading branch. Auth transport and domain logic unchanged. Typecheck, lint, build passed. Playwright targeted 2/2 passed: held inventory response during /shop entry and refresh, reduced motion, ready state, 401 sign-in and 503 retry. API responses simulated; no live login/email/database verification in this presentation-only change. No branch merge or production deployment.
