# Redesign — approved layout and font

Source: user's explicit implement request and outputs/redesign/index.html. Font A IBM Plex Sans Thai Looped selected.

- Preserve all existing features, workflow, localStorage key/schema and stock commands. No Dashboard, graphs, Chat or notification features.
- Preserve DESIGN.md color, shape, spacing and type size tokens; change font family to selected self-hosted font, including PNG bills.
- Compact product cards with native accessible expansion for existing size/color/stock management; code → size → color, visible quantity/unit.
- Icons plus Thai navigation labels; mobile bottom navigation, desktop sidebar; coherent card/form treatment on every page.
- Verify existing workflows, typecheck, lint, build, mobile/desktop widths and exported PNG; code-review against this scope.

Before snapshot: .scratch/redesign/before, taken before redesign source edits. Workspace is not a Git repository; compare saved files directly. New shared icon is src/Icon.tsx. Domain/storage code is outside the redesign change set.

Mock sample records are not imported into the app. Empty real state remains empty.
