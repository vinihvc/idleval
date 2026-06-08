# components/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

All game UI — primitives, overlays, shell, and debug tools.

## Do

- Use `export const` named exports (`FactoryCard`, `SettingsDialog`)
- Strings via `m["ui.*"]()` from `@/i18n/messages`
- State via store hooks (`useWallet`, `useFactory`, `useGods`)
- Mutations via imported actions (`upgradeFactory`, `invokeGod`, `resetGame`)
- Dialogs with `ResponsiveDialog` (Dialog ≥768px, Drawer below)
- Ark UI primitives + `tailwind-variants` (`tv`) + `cn()`
- Images with `@unpic/react` `Image`; icons with `pixelarticons/react/IconName` (per-icon imports, not the root barrel)
- Lazy-load domain dialogs via `@/components/dialog/lazy` + `<Suspense fallback={null}>` at call sites; tests import dialog modules directly

## Don't

- Define components inside other components
- Hardcode strings in JSX
- Inline purchase/economy logic — use `game/` + store actions
- Create barrel files that re-export everything
- Change `data-slot` without reason (used for styling)

## Patterns

- Suffixes: `*Dialog` (overlays), `*Card` (list items), dot-files for subparts (`factory-card.produce.tsx`)
- Props via `interface XxxProps`
- `ResponsiveDialogTrigger asChild` on triggers
- `sr-only` on icon-only buttons; labels on inputs
- Component tests: `component-name.test.tsx` colocated in `component-name/` with `vitest-browser-react` + `renderWithProviders` from `@/test/render-with-providers`
- One folder per component: `button/button.tsx` + `button/index.ts` exporting the public API

## Subfolders

| Subfolder | Role |
|-----------|------|
| `ui/` | Design-system primitives (button, dialog, drawer, field, slider, toggle, select) |
| `ui/factory-card/`, `ui/upgrade-card/` | Composites with provider + dot-notation subfiles |
| `dialog/` | Domain overlays (`settings/`, `upgrades/`, `managers/`, `gods/`) |
| `layout/` | Shell: `game-shell`, `game-panel`, `factory-grid`, `header/`, `navigation`, `footer` |
| `icons/` | Custom SVGs (`coin`, `logo`, `wax-seal`) |
| `debug/` | Dev-only (`debug-tools`, `media-query`) |

## Key files

| File | Role |
|------|------|
| `ui/responsive-dialog/` | Adaptive Dialog/Drawer (768px breakpoint) |
| `dialog/lazy.tsx` | `React.lazy` wrappers for domain dialogs |
| `layout/factory-grid/` | Main factory grid |
| `layout/navigation/` | Mobile + desktop nav |

## Neighbors

- Reads from: `store/`, `game/` (can*), `content/` (lists), `i18n/`, `providers/sound`
- Consumed by: `app/page.tsx`

## Evolution

- 2026-06-07 — Tree-shaking: pixelarticons per-icon imports + lazy dialog wrappers
- 2026-06-07 — Component folder layout + `*.test.tsx` browser tests (replacing `*.browser.tsx`)
- 2026-06-07 — Browser component tests via vitest-browser-react
- 2026-06-07 — Initial docs: ui/dialog/layout + i18n + ResponsiveDialog
