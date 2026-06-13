# components/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

All game UI — primitives, overlays, shell, and debug tools.

## Do

- Use `export const` named exports (`FactoryCard`, `SettingsDialog`)
- Strings via `m["ui.*"]()` from `@/i18n/messages`
- State via store hooks (`useWallet`, `useFactory`, `useGods`)
- Mutations via imported actions (`upgradeFactory`, `invokeGod`, `resetGame`)
- Domain dialogs read `useDialogOpen(id)` and write through `setDialogOpen(id, open)`; triggers live at call sites and call `toggleDialog(id)`
- Tooltips with `ResponsiveTooltip` (Tooltip ≥768px, ToggleTooltip below)
- Ark UI primitives + `tailwind-variants` (`tv`) + `cn()`
- Box elevation via `boxBorder()` from `ui/box-border/`
- Images with `@unpic/react` `Image`; icons with `pixelarticons/react/IconName` (per-icon imports, not the root barrel)
- Lazy-load domain dialogs with `<Suspense fallback={null}>` around only the dialog component; keep trigger buttons outside `Suspense`

## Don't

- Define components inside other components
- Hardcode strings in JSX
- Inline purchase/economy logic — use `game/` + store actions
- Create barrel files that re-export everything
- Change `data-slot` without reason (used for styling)

## Visual variants (dev tooling)

For **future** A/B/C/D comparisons of new UI, use [`@/providers/variant-tools`](../providers/variant-tools.tsx) + [`debug/variant-tools.tsx`](debug/variant-tools.tsx) (fixed top-right, hotkeys 1–4 in dev). Define `Record<VariantTools, …>` presets in the target component and pick with `usePickVariantTools`.

**UpgradeCard** is a stateless compound primitive (`UpgradeCard`, `UpgradeCardPanel`, `UpgradeCardArt`, `UpgradeCardSeal`, …) with a fixed green preset — domain cards own `getSealedState` / `useHoldPress`; do not wire to variant-tools.

## Patterns

- Suffixes: `*Dialog` (overlays), `*Card` (list items), dot-files for subparts (`factory-card.produce.tsx`)
- Props via `interface XxxProps`
- `ResponsiveDialog` for content only (Dialog ≥768px, Drawer below); avoid `ResponsiveDialogTrigger` and trigger-as-children in domain dialogs
- `sr-only` on icon-only buttons; labels on inputs
- Component tests: `component-name.test.tsx` colocated in `component-name/` with `vitest-browser-react` + `renderWithProviders` from `@/test/render-with-providers`
- One folder per component: `button/button.tsx` + `button/index.ts` exporting the public API

## Subfolders

| Subfolder | Role |
|-----------|------|
| `ui/` | Design-system primitives (`text-border`, button, dialog, drawer, …) |
| `ui/factory-card/`, `ui/upgrade-card/` | Composites with provider + dot-notation subfiles |
| `dialog/` | Domain overlays (`settings/`, `wiki/`, `upgrades/`, `managers/`, `gods/`, `inventory/`, `offline-earning/`) |
| `game/` | Game shell: `shell/`, `panel/`, `stage/`, `factory-grid/` |
| `layout/` | Chrome: `header/`, `navigation/`, `footer/`, `background/` |
| `icons/` | Custom SVGs (`coin`, `logo`, `wax-seal`) |
| `debug/` | Dev-only (`variant-tools` fixed top-right, `action-tools` bottom bar, `media-query`) |

## Key files

| File | Role |
|------|------|
| `ui/responsive-dialog/` | Adaptive Dialog/Drawer (768px breakpoint) |
| `ui/responsive-tooltip/` | Adaptive Tooltip/ToggleTooltip (768px breakpoint) |
| `game/stage/` | Persistent stage strip (messages, sprites, power-up status) |
| `game/factory-grid/` | Main factory grid |
| `layout/navigation/` | Mobile + desktop nav |

## Neighbors

- Reads from: `store/`, `game/` (can*), `content/` (lists), `i18n/`, `providers/sound`, `providers/variant-tools` (dev A–D for future components)
- Consumed by: `app/page.tsx`

## Evolution

- 2026-06-08 — Game shell moved from `layout/` to `game/` (`shell`, `panel`, `stage`, `factory-grid`)
- 2026-06-08 — `ui/menu` (Shark) + debug dialog menu in ActionTools
- 2026-06-08 — UpgradeCard refactored to stateless compound API in single file; domain cards compose named subparts
- 2026-06-08 — Restored `ui/box-border/`; elevation via `boxBorder()` instead of `globals.css` utilities
- 2026-06-08 — `variant-tools` fixed top-right; `action-tools` bottom ActionBar
- 2026-06-08 — ResponsiveTooltip (Tooltip ≥768px, ToggleTooltip below)
- 2026-06-13 — Domain dialog open state centralized in `store/atoms/dialogs`; triggers stay outside dialog wrappers and Suspense
