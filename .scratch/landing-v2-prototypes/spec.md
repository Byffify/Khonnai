# Khonnai landing v2 composition prototypes

Status: done

Decision: compare two complete compositions before choosing production implementation.

Reference: docs/research/fastwork/live-review-and-khonnai-v2.md.

Constraints: white, #193b5a, #ed7c32; current Anuphan, Plus Jakarta and Rammetto wordmark. Isolated demo only. No production source, shop storage, app flows or receipt changes. Thai content; desktop1440 and mobile390. Working size/color/stock demo, task panels, reduced motion and replay.

## Prototype playbook

1. Scope the decision the prototype exists to make. Compare centered card assembly with editorial workbench.
2. Gather references when the design space is open. Skip: approved Fastwork brief fixes the direction.
3. Build throwaway in an isolated scratch dir, separate from production source.
4. When comparing alternatives, build them behind one switcher, each variant labeled.
5. Verify on the matching surface. Capture both sizes, drive selections and inspect motion.
6. Present alternatives, tradeoffs, and a recommendation.

## Throughput checkpoint

Two independent candidates write separate HTML files. Root owns preview server, comparison, captures and verification. No production integration until the user selects a direction.

Arena Frame/Fan out/Cross-judge/Pick/Graft/Verify: compare clarity, structural difference, brand fidelity, responsive behavior and meaningful motion. Graft deferred because the user must choose a composition before synthesis.

## Comments

Both prototypes complete. Real browser captures and verification saved in outputs/landing-v2-prototypes. Independent source comparison recommends A for Fastwork brand choreography; root browser review agrees, with B stronger for immediate demo access. Fixed B mobile nav CTA and text contrast/captions before final capture. Production src hashes unchanged. Await user composition choice before production work.
