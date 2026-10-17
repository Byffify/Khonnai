# Khonnai landing motion prototype

Review18 October2026. Latest prototype is `.scratch/landing-v2-prototypes/d.html`, served at http://127.0.0.1:5288/d.html. This is an isolated design instrument, not the production landing.

## Sources and what was inspected

- [Hover Greyscale Logo Carousel](https://www.hover.dev/components/testimonials#hover-greyscale-logo-carousel). Inspected actual moving logo row and DOM transform. Adapted to Khonnai capabilities rather than customer/partner logos. Source loop duration was not measured.
- [Neu Pricing](https://www.hover.dev/components/pricing#neu-pricing). Opened its embedded public preview directly. Three columns, monthly/annual selector and emphasis on the middle tier. Adapted to Khonnai soft white/navy/orange surfaces, without copying source code behind paid access.
- [Disappearing Features](https://www.hover.dev/components/features#disappearing-features-(scroll)). Opened public preview and scrolled. Left explanation remains present while feature panels progress on the right. Adapted to four selected app screenshots rather than exposing the complete app.
- [Smooth Scroll Hero](https://www.hover.dev/components/heros#smooth-scroll-hero). Opened public preview and scrolled. Central imagery changes framing/scale and secondary imagery enters. Adapted to a generated Thai shop photo with a bounded frame/scale change, white brand shell and accessible CTA.
- [Khonnai pitch](https://startup-pitch-deck.vercel.app/#1.0). Read menu and all8slide sections, navigated through reveal beats. Some snapshots lagged the URL during transitions; collected settled states before taking product claims. The site did not render through web extraction; the live browser provided the evidence.

Broader catalog review is in [hover-motion-inventory.md](hover-motion-inventory.md). Eleven category pages were inspected as text; other categories were indexed. This is not a claim that every Hover component and every interaction was tested.

## Slide-to-landing decisions

| Slide | Evidence in supplied deck | Decision |
|---|---|---|
|1 Introduction|Stock and bills together for wholesale underwear shops|Keep product mechanism and multi-size/color audience; do not imply a general ERP suite|
|2 Why this problem|35% GDP and8% digital-use figures are attributed to different datasets; not Khonnai market size|Do not turn figures into decorative credibility counters or a customer claim. They were read in the supplied deck, not independently revalidated in this task|
|3 Problem|One family case interview; repeated stock checks, separate records, handwritten bills|Use the bounded problem language “ขายหนึ่งครั้ง เช็กซ้ำหลายรอบ”; do not present one interview as market validation or add LINE/location features|
|4 Solution|Select product→size/color/count→review sale→bill/new stock; example12−3=9,3×150=450|Use four teaser screenshots and a separate explanatory sale scene. Clearly label sample data|
|5 Early adopter|Owner decides and operates, multiple variants, willing to trial; one interview and no trial yet|Use shop-owner language and human shop context; no invented customer logos/testimonials|
|6 Market sizing|TAM8,770, SAM5,696, SOM12target; explicitly no paying customers|Keep these out of public landing proof. Do not show12as actual users|
|7 Business model|Free0, Basic299, Pro699 per month; proposed quotas;10%annual reduction; willingness-to-pay untested|Latest explicit user request authorizes a pricing prototype. Show as future proposal with no payment/signup. Annual total3,229.20/7,549.20, clearly per year|
|8 Validation|Use independently, correct balances, willingness to pay are future validation goals; “Less Checking, More Selling.”|Use the slogan as intent, not quantified results or a completed trial|

## Prototype contents

The hero photo is generated with Imagegen and labeled as an AI illustration, not an actual customer. It depicts a Thai shop owner arranging packaged clothing. It is not evidence for SME statistics. Brand remains white, navy `#193b5a`, orange `#ed7c32`, Anuphan/Plus Jakarta and the existing Rammetto gradient wordmark.

The capability rail has seven original buttons and an inaccessible duplicate used only for seamless looping. Proposed34second loop pauses on hover/focus, via a visible control, when offscreen/hidden, and stops under reduced motion. Buttons lead to a small isolated demo or backup explanation.

The scroll teaser shows four selected views from the supplied slide deck. On desktop a sticky explanation remains beside successive panels. Mobile uses its own vertical sequence. Reduced motion makes panels ordinary visible content. The app screenshots are the version embedded in the supplied deck, with its older visual treatment; they are not a claim that the production app currently looks exactly like those screenshots.

The optional size/color example stays under a disclosure. This gives visitors a small interaction without exposing every application flow. It uses in-memory demo values, not the shop data key.

Pricing includes Free20codes/50bills, Basic200/500, Pro1,000/2,000as future proposed quotas. They are not restrictions currently enforced by the app. Buttons on paid proposals disclose details, and no account, checkout or payment is created.

## Skills and next step

Poteto Mode routes this as Prototype. Impeccable Animate defines focal motion, feedback, interruption and reduced-motion alternatives. Existing frontend-design/premium context supplies brand and cross-screen constraints. No additional skill installation or animation dependency is needed for the prototype.

Exhaust the Design Space preserves A/B as comparisons while D explores the new references. Model the Domain keeps selection and billing period in explicit in-memory values. Prove It Works requires checking the actual browser artifact. After choosing a direction, use the Feature playbook for production implementation and Impeccable Adapt/Harden for production responsive and edge-state work.

## Verification boundary

See `outputs/landing-motion-prototype/verification.json` and screenshots/video for the actual browser results. No production build or regression-suite result is claimed by this research document. No real-device, screen-reader, FPS or performance benchmark was run. Source timings were not measured from Hover video;34second rail and other durations are authored Khonnai prototype values.
