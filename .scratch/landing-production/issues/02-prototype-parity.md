# Remove extra landing copy and align prototype proportions

Status: done
Blocked by: none

## Comments

- Remove the optional size/color demo and the specified explanatory paragraphs and visible carousel footer/count. Keep the primary four-step sale demonstration.
- Reduce the billing switch to approximately54px overall at regular viewport sizes; preserve accessible controls and the numeric price transition.
- Compare every landing section with prototype D on desktop/mobile. Keep approved Noto, bilingual URLs, simplified copy and SEO as intentional differences. Restore unintended visual/motion drift.
- Before measurements: billing72.2px vs54px, navigation1120px vs984px, preparation cards440/430px vs420/380px desktop/mobile. Screenshots and metrics: outputs/landing-parity/.
- Removed requested helper copy, optional demo/controller state and visible carousel footer. Removed prototype label and made the closing surface white in both versions.
- Restored prototype icon marquee, hero reveal, faded preceding demo cards, proportions, headings, navbar, pricing switch and preparation card sizes. Kept approved Noto, localization, simpler text and SEO.
- Lint/build passed;5/5 landing browser checks passed including320/390/768/1440px and200% zoom. Rendered comparison of all sections at1440/390px had no page errors. Full report: docs/research/landing-prototype-parity.md.

- User correction: restore the original prototype closing background `#fff0e4` in production and prototype; keep the prototype label removed. The preceding white-background interpretation was incorrect.
