# Candidate A: isolated pathname boundary

## Phase checklist

- Ground: complete; current `main.tsx` mounts LanguageProvider → App, all browser flows enter `/`.
- Sketch: complete below.
- Agree: caller synthesizes against another candidate.
- Implement: outside this candidate's scope.
- Scrap: no implementation to remove.

## Caller usage first

```tsx
// main.tsx; one pathname decision, no client routing framework
<StrictMode>
  <LanguageProvider>
    {window.location.pathname.replace(/\/$/, '') === '/landing'
      ? <Landing />
      : <App />}
  </LanguageProvider>
</StrictMode>
```

The existing `/` application remains the default, including existing unknown-path behavior. Landing CTAs are ordinary `<a href="/">` links. Its own section navigation uses native fragment anchors. Browser reload/back already supplies the needed transitions between independent surfaces. The landing does not need to mount App or know about shop state.

## Data shape and module sketch

```tsx
// src/Landing.tsx: only public API
export function Landing(): React.JSX.Element {
  // not implemented: compose header, hero, showcase, capabilities, FAQ, CTA, footer
}

// Private, local product demonstration, never import inventory/storage.
const exampleVariants = [
  { size: 'M', colors: [{ id: 'black', available: 12 }, { id: 'white', available: 8 }] },
  { size: 'L', colors: [{ id: 'black', available: 9 }, { id: 'white', available: 6 }] },
] as const
type ExampleVariant = typeof exampleVariants[number]
// Default size is selected deliberately by initial demonstration design.
// Selected color resets on changing size; render a prompt until color is chosen.
type ShowcaseSelection = {
  size: ExampleVariant['size'];
  color: 'black' | 'white' | null;
}
```

Keep the showcase inside `Landing.tsx` until its real complexity justifies extraction. A single `useState<ShowcaseSelection>` owns selection. Clicking size replaces the pair with `{size, color:null}`; clicking color changes only color. These are presentation choices, not sales commands. Clearly label the display as an example, with fixed example stock and no customer data, pretend save, checkout or persistence. Size and color buttons use `aria-pressed`; stock text updates immediately. No animation delays the value.

`useI18n()` owns language and locale. Add landing-specific Thai/English copy to the existing translation map, keeping one language provider and preference owner. Display the existing `Brand`; keep its semantic text, gradient and font. CTA remains an anchor styled as the existing primary button. Do not add a second shared button abstraction for the landing.

`src/landing.css` owns `.landing` descendants only. Reuse all `--ds-*` values and existing self-hosted fonts. Explicitly scope heading sizes, content widths, responsive spacing, anchor styles, and illustrative panels; global `main`, `h1`, `.stack`, `.row`, and `.button` rules otherwise apply. No token generator change is necessary for a larger landing headline using scoped clamp typography. Never change receipt variables.

## Motion lifecycle

Prefer one entrance treatment and tactile hover/press feedback using existing durations/easing. Content must be visible by default, including without IntersectionObserver. A root ref plus a single effect may observe `[data-reveal]` targets; add the enhancement class only after observation setup. Revealed nodes are unobserved. Cleanup disconnects the observer and removes enhancement markers to survive React StrictMode effect replay. Observe `(prefers-reduced-motion: reduce)` and return final states immediately; remove media-query listener on cleanup. No persistent timers, per-frame loops or scroll handlers. No component-local observer abstraction unless another caller appears.

## Strong alternative: multi-page Vite entry

A separate `landing.html` → `landing-main.tsx` entry can keep the App bundle and its imports out of the public page entirely. It needs Vite multi-entry build configuration, separate metadata/HTML maintenance and an intentional URL mapping (often `/landing.html` unless hosting rewrites exist). Good if independently deployed marketing content or SEO ownership becomes a concrete requirement. For today's single Vite deployment, pathname selection is smaller and preserves the existing app's development/test contract. Static import can later become `React.lazy` only if measured bundle weight justifies the loading boundary; do not add it speculatively.

## Acceptance

- `/` still opens Products with original five operational menus and all current tests unchanged.
- `/landing` direct load and reload show the landing, never operational shell or draft dialogs.
- CTA opens `/`; ordinary browser Back returns to landing.
- Landing render and showcase interactions leave `micro-erp-v1` absent or byte-identical to a seeded value, including corrupt data.
- Thai/English text switches through the existing provider; no data text is rewritten.
- Keyboard reaches navigation, language, showcase, FAQ and CTA; focus remains visible.
- 320/390/768/1440 widths, 200% zoom and long Thai do not overflow or obscure CTAs.
- Reduced-motion mode shows all content with no entrance displacement or loops.
- Unit, typecheck, lint, build, token drift and complete browser suite run; frozen receipt PNG matches.

## Red-flag review

One route boundary and one showcase owner avoid split ownership. One variant table supplies sizes/colors/counts rather than hand-synced separate lists. No wrapper merely forwards component props. Landing cannot call commit/restore because it imports neither domain nor storage. Routing logic remains in the entry file rather than scattered across marketing sections. The route is intentionally not a generic router: adding a third navigation surface should prompt re-evaluation.

Principles applied: Model the Domain changes the demo from independent, potentially inconsistent size/color booleans into one selection value; Type System Discipline derives selectable sizes from the example table and keeps all state local.
