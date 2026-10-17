# Khonnai landing page

Status: done
Blocked by: none

## User-approved scope

Create a public landing using the reverse-engineered Fastwork foundations archived in docs/research/fastwork/, with Khonnai white/navy/orange palette, existing fonts/wordmark/mascot and component geometry. User chose large heading + interactive size/color product example showing stock before/after sale. Existing operational app and receipt appearance remain intact.

## Feature checklist

1. `how` over the affected subsystem.
2. `architect` for parallel design exploration.
3. Write the throughput checkpoint as four todo items.
4. Delegate code-writing to a subagent using your configured feature model.
5. Verify on the matching surface.
6. Rebase into small, ordered commits. Stack follow-ups. — skip: current checkout contains prior user work; no commit/rebase requested.
7. If the design is contested, `interrogate` before shipping. — n/a: user selected the recommended composition.
8. Run **Opening a PR**. — skip: local deliverable; no PR or publication requested.

## Throughput checkpoint

- Blocking first steps: resolve /landing seam, product claims, DS/motion sources and confirmed composition before code.
- Independent workstreams: one worker owns Landing.tsx + landing.css; root owns main entry, browser tests and docs.
- Shared mutable state: no shared write files; demo state is in-memory presentation only. No inventory/storage imports.
- Smallest safe decomposition: one UI owner keeps bilingual copy/demo/geometry coherent; root separately verifies real browser behavior and app regression.

## Acceptance

- /landing and /landing/ load public surface, / keeps operational app, CTA and browser Back work.
- Thai/English reuses current language provider; native language control is labeled.
- Interactive example deliberately selects size then color and displays stock arithmetic immediately; illustrative values clearly labeled. No fake sales/save and no storage writes.
- Fastwork motion language: controls125/160ms, content220/240ms, bounded scene reveal/sequence up to700ms, existing exponential easing. No indefinite loops; reduced-motion final content.
- All section links, FAQ, CTA and demo controls operate; keyboard focus, mobile320/390/768 and desktop1440 no overflow.
- No fabricated metrics, customers, endorsements, pricing, online backup or login. Clearly state local browser data and manual backup.
- No real shop data in visuals; preserve paper/PNG and operational tests.

## Direction contract

THESIS: Know what's available before selling; demonstrate photo/code → size → color → before/after quantity. The product interaction carries the hero.
OWN-WORLD: Fastwork neutral white surfaces, generous separation, capsule navy CTA, orange accents,16px cards, Anuphan/Plus Jakarta, original Iconly and Rammetto navy-to-orange wordmark only.
STORY: A shop owner recognizes daily stock/bill tasks, tries a harmless example, understands local-data constraints, enters the existing app.
FIRST VIEWPORT: Clear navigation; oversized Thai headline and short supporting copy; navy primary CTA; broad framed product demonstration with size/color choices and before/sold/after quantities. Mobile stacks content naturally.
FORM: User selected big headline plus interactive product stage; concept seed1179d38f was degraded (no remote challengers), user selection overrides the random composition deal.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Delivered behavior

The demonstration retains the selected color when changing size because both example colors exist for every example size; each selection immediately recomputes the single illustrative table. This simplifies the landing only; the operational catalog flow stays unchanged. The implementation and reviewed captures are documented in docs/research/landing-implementation.md.
