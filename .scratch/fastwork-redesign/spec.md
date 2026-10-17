# Fastwork redesign — Khonnai

Approved implementation plan: user message in this chat, 2026-10-17.

## Scope

Redesign every operational screen using white surfaces, orange #ed7c32, navy #193b5a, Fastwork layout/type/components/motion, existing self-hosted fonts and icons. Preserve all domain rules, persistence, native controls, form field order, validation, confirmation, recovery, keyboard/focus and navigation destinations. Landing remains deferred.

Receipt screen image and downloaded PNG must retain their existing appearance, confirmed by the user. Record a fixed-fixture baseline before changing app tokens; separate receipt presentation tokens before production redesign.

## Sequence

1. Baseline and representative mobile/desktop mockups: catalog, detail, sale form.
2. User confirms the concrete shared visual system before production UI changes, as required by approved plan step 2 and PRODUCT.md.
3. Update DESIGN/UX-CONTRACT/token generation, shared primitives, then all operational screens.
4. Verify typecheck/lint/unit/build/browser, receipt equality, viewport/zoom/focus/states/reduced-motion and visual review.

## Visual contract

White sidebar/bottom nav, same five menus, desktop breakpoint1024. Neutral text/surfaces/borders; navy selected and orange add actions. Control52px, size chips48px, control radius12/card16, body18/28, label16/24, caption14/22, heading28/36 mobile and32/40 desktop. Keep code/photo-only catalog and explicit size selection. No new dashboard, wizard, marketing hero or marketplace functionality.

Motion: controls125–160ms; content180–240ms max8px; disclosures200–280ms; dialogs240–320ms; feedback160–220ms; loading225ms only if still pending. Reduced motion renders final states immediately; business commits never depend on animation.

## Current boundary

Preview approved in chat. Production presentation implementation authorized. Follow-up: use Iconly SVGs and a Rammetto One English wordmark with navy on the left and orange on the right. Preserve receipt appearance and all workflows.
