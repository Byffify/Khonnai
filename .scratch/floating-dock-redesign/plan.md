# Quiet Gallery and Floating Dock implementation plan

> Execute inline with superpowers:executing-plans. User authorized implementation on 19 October 2026.

**Goal:** Apply the approved photo-and-code gallery and shared floating glass navigation to all five operational pages.

**Architecture:** Keep App as the single navigation owner and reuse existing feature/form/feedback owners. Extend canonical DESIGN.md tokens and the existing stylesheet; preserve domain commands and receipt rendering.

**Tech stack:** React, TypeScript, Vite, existing CSS/tokens, Playwright.

**Spec:** `.scratch/floating-dock-redesign/spec.md`, updated by the latest user decision: Quiet Gallery, not Compact Cards.

## Global constraints

- White canvas, navy #193b5a, orange #ed7c32, Anuphan/Plus Jakarta Sans and existing wordmark.
- Two gallery columns on phones, three from 601px; photo and full readable code form one button.
- The same five-label glass bottom dock on every viewport, with safe-area clearance and solid fallback.
- Native controls, 48–52px targets, original draft guards and quantity units.
- No stock/schema/receipt/auth/landing behavior changes; preserve pre-existing uncommitted work.

## Review focus

- Long Thai codes and English navigation at 320px must wrap without horizontal overflow.
- Final actions/errors must scroll above the floating dock.
- Product details require deliberate size selection and restore search/focus on Back.
- Busy/recovery states must retain existing guards, accessible names and focus.
- Receipt bytes and local/cloud data boundaries stay independent of presentation.

## Tasks

- [x] 1. Add focused browser coverage; watch the old edge-to-edge/sidebar navigation fail the floating-inset assertion.
  Files: `tests/browser.spec.ts`. Run `npx.cmd playwright test -g "quiet gallery and floating dock"`.
- [x] 2. Implement shared tokens/layout, gallery footer and detail work area; apply common page headers to bills/reservations.
  Files: `DESIGN.md`, `UX-CONTRACT.md`, `src/index.css`, `src/styles/tokens.css`, `src/App.tsx`, `src/features/Catalog.tsx`, `src/features/Transactions.tsx`, `src/messages.ts`.
  Interfaces: keep `FeatureProps`, command handlers, `Button`, `Field`, `Form`, `BackButton` unchanged.
- [x] 3. Run targeted browser coverage and existing workflow suite; inspect desktop/mobile captures, fix material issues, and request independent review.
  Commands: theme:check, typecheck, lint, test, build, test:browser; premium static audit. Record actual results in the issue.

## Decisions

- Use the current checkout on `codex/quiet-gallery-dock` so existing auth/loading changes remain present; no unrelated files are staged or reset.
- Ruling: latest instruction explicitly authorizes summarizing and starting inline; do not insert another design/plan approval stop.
