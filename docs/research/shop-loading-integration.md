# Brand loading motion integration

Worktree branch codex/shop-loading-motion starts from main515027e, without authentication-feature merged. ShopLoading is presentation-only and uses the existing Brand, fonts and token system. It has no dependency on Auth, storage, requests or domain commands.

## Review

Run Vite on an unused local port and open /loading-preview.html. Add ?lang=en for English. This dev-only HTML is excluded from the production build entries and intentionally holds the animation for visual review. The real fallback disappears immediately when its lazy content is ready.

The visible loading sentence was removed at user request; a screen-reader-only status remains. The mascot rises4px with a small scale change; three status dots use navy/orange. Reduced motion keeps all content visible without animation. No minimum load duration or fabricated percentage.

## Auth compatibility

Only src/SiteEntry.tsx overlaps Auth. Its loading function is replaced with the component while retaining language selection. The Auth routing, providers, session, data and styles are not edited.

Main does not contain src/CloudApp.tsx. After the branches are combined, its existing loading screen can use the same component:

```tsx
import { ShopLoading } from './ShopLoading'

// Keep existing request, session, error and ready-state handling.
if (screen.kind === 'loading') {
  return <ShopLoading label={language === 'th' ? 'กำลังเปิดข้อมูลร้าน…' : 'Opening shop data…'} />
}
```

Do not introduce a timer around the ready branch or couple authentication to animation events. This note is a future integration instruction, not a claim that Supabase loading changed on this main-only branch.

## Verification

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
node node_modules/@playwright/test/cli.js test --config .scratch/shop-loading-motion/playwright.config.ts
```

Browser tests gate the actual lazy module request rather than adding a delay to product code. The merge rehearsal reads the common ancestor, Auth version and proposed SiteEntry into temporary files and runs git merge-file without modifying either branch. A clean text merge only proves the current snapshots combine; integration tests must still run after future branch changes.
