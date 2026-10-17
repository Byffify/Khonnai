# Add complete Thai/English UI language with settings preference

Status: done
Blocked by: none

## Comments

- Preserve existing visual system, domain/storage contracts and frozen receipt. Red-first browser acceptance tests cover actual English workflows and preference failures.


- Latest user clarification implemented: categorized Settings menu opens separate internal pages, each with labeled Iconly back arrow. Back restores originating row focus and retains shop draft; leaving Settings retains discard confirmation. Recovery remains directly available.
- Final verification: typecheck, lint,18 unit tests, build and theme:check passed. Full browser suite27/27 passed after compact English nav correction; fixed receipt PNG matches baseline in Thai and English. Premium strict audit0 findings; Impeccable4 incumbent exceptions recorded in docs/research/language-settings.md.
- Screenshots reviewed for Thai/English desktop/mobile menu and subpages, with isolated synthetic data. Device/OS/screen-reader limits and English font recommendations recorded in the research report.
