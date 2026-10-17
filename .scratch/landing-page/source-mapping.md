# Landing source mapping

This is a Khonnai landing built from the archived reverse-engineered Fastwork foundation, not a reproduction of an Apple/Mercedes page.

| Role | Source | Khonnai application |
|---|---|---|
| White surfaces, gray separators | fastwork/css-motion-inventory.md §1 | Current --ds-paper/--ds-surface/--ds-border |
| Brand | User brief / DESIGN.md | Navy #193b5a and orange #ed7c32, existing Rammetto wordmark |
| Body and labels | Shared Fastwork18/28 and16/24 hierarchy | Current Plus Jakarta/Anuphan fonts; self-hosted |
| Components | Inventory§2 | Capsule CTA, native language control, size chips,16px cards, Iconly |
| Feedback | Inventory§3.1 |125/160ms and cubic-bezier(.24,1,.4,1) from runtime tokens |
| Content transitions | Khonnai adaptation / archive |220/240ms; semantic numbers update before animation |
| Landing composition | landing-reference.md / user selection | Large headline with product/size/color stage; authored Khonnai content |
| Hero entrance | Inventory§3.2 | Bounded landing-specific choreography using the recorded700ms scale; no loop or delayed ability to act |
| Accessibility | Landing archive + current app contract | Final content for reduced motion, native FAQ/language, real links and focus |

CSS/keyframe observations in the archive are evidence of shipped declarations. The implementation uses selected principles and timings; it does not claim exact Fastwork JS orchestration or pixel equivalence. No Fastwork photographs, customer claims, assets or text are copied into the page. Product examples are illustrative and do not touch shop records.

## Content boundaries

Explain inventory by code/size/color, sale records and stock deduction, reservations reducing available stock, returns/exchanges and manual JSON backup. No fabricated adoption metrics, price tier, cloud backup, account login or synchronized devices. Opening the app goes to the existing local browser app.

## Delivery

Public route /landing and /landing/; operational app remains /. SPA hosting must serve index.html for the landing route; independent static SEO/prerendering is outside this local implementation.
