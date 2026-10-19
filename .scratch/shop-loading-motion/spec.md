# Brand motion while opening the shop

Start from origin/main515027e in the managed worktree, branch codex/shop-loading-motion. Do not merge authentication-feature or read local Auth configuration. Keep operational, landing and receipt behavior unchanged.

Motion thesis: the existing mascot lifts4px and expands2.5% in a soft1600ms loop, with three navy/orange status signals below the unchanged brand wordmark. White canvas, existing fonts, no new animation dependency. The status label is available to assistive technology only; the user requested removing the visible loading text. Reduced motion displays the final static brand and signals. No progress percentage, focus move, minimum loading delay, animationend callback or simulated wait in the real app.

Caller shape: <ShopLoading label={localizedStatus} />. A presentation-only component without timers, authentication or persistence. SiteEntry's existing Suspense chooses whether it is mounted; ready content replaces it immediately. Dedicated dev-only loading-preview.html keeps the animation visible for review without delaying real loading.

Collision audit: Auth changes App.tsx, AuthPage.tsx, CloudApp.tsx, SiteEntry.tsx, auth.css, authPolicy.ts, data/cloud.ts, Settings.tsx, index.css and vite.config.ts relative to main. This change adds separate component/CSS/preview/tests and touches only the SiteEntry import and existing loading return. Do not edit App, index.css, Brand or Auth files. Verify the changed SiteEntry against the common ancestor and authentication-feature with a temporary merge-file rehearsal. Such rehearsal does not modify branches or constitute an actual merge.

Main has no Supabase CloudApp. Its network-data loading state remains exclusively on authentication-feature. After combining the independently reviewed branches, CloudApp may import ShopLoading for its loading discriminant using the integration note. Do not copy Auth implementation into this branch just to show the animation.

Verify real Suspense by holding the App module request in a browser, inspect mobile/desktop, reduced motion, English, unchanged localStorage and immediate ready-content replacement. Preview is not a functional-login demo.
