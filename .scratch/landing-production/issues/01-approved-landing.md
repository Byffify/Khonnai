# Implement approved bilingual landing

Status: done
Blocked by: none

## Comments

- User approved prototype D and requested implementation, plain language, Thai/English, Noto Sans and strong SEO foundations.
- Existing uncommitted main.tsx, DESIGN.md and browser-test changes are preserved. App remains at `/`; marketing routes are separate.
- Implemented static Thai/English landing, Noto fonts, plain copy, SEO metadata/sitemap, approved photo hero/carousel/pricing, larger headline and continuous left-to-right keyword highlights with unbroken phrases.
- Verified typecheck, lint,69 theme tokens,18 unit tests, production build,32/32 browser tests, both languages across320/390/768/1440px and200% zoom, reduced motion and forced colors. Production-build local preview serves both localized HTML pages. No deployment performed.
