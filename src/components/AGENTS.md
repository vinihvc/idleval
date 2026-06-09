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
- Tooltips with `ResponsiveTooltip` (Tooltip ≥768px, ToggleTooltip below)
- Ark UI primitives + `tailwind-variants` (`tv`) + `cn()`
- Box elevation via `boxBorder()` from `@/components/ui/box-border` (same variant names as `borderedText`)
- Images with `@unpic/react` `Image`; icons with `pixelarticons/react/IconName` (per-icon imports, not the root barrel)
- Lazy-load domain dialogs via colocated `lazy.ts` + `<Suspense fallback={null}>` at call sites; tests import dialog modules directly

## Don't

- Define components inside other components
- Hardcode strings in JSX
- Inline purchase/economy logic — use `game/` + store actions
- Create barrel files that re-export everything
- Change `data-slot` without reason (used for styling)

## Visual variants (dev tooling)

For **future** A/B/C/D comparisons of new UI, use [`@/providers/variant-tools`](../providers/variant-tools.tsx) + [`debug/variant-tools.tsx`](debug/variant-tools.tsx) (fixed top-right, hotkeys 1–4 in dev). Define `Record<VariantTools, …>` presets in the target component and pick with `usePickVariantTools`.

**UpgradeCard** uses a single fixed green preset (former variant D) — do not wire it to variant-tools.

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
| `ui/` | Design-system primitives (`box-border`, `text-border`, button, dialog, drawer, …) |
| `ui/factory-card/`, `ui/upgrade-card/` | Composites with provider + dot-notation subfiles |
| `dialog/` | Domain overlays (`settings/`, `wiki/`, `upgrades/`, `managers/`, `gods/`, `inventory/`, `offline-earning/`) |
| `layout/` | Shell: `game-shell`, `game-panel`, `game-stage`, `factory-grid`, `header/`, `navigation`, `footer` |
| `icons/` | Custom SVGs (`coin`, `logo`, `wax-seal`) |
| `debug/` | Dev-only (`variant-tools` fixed top-right, `action-tools` bottom bar, `media-query`) |

## Key files

| File | Role |
|------|------|
| `ui/responsive-dialog/` | Adaptive Dialog/Drawer (768px breakpoint) |
| `ui/responsive-tooltip/` | Adaptive Tooltip/ToggleTooltip (768px breakpoint) |
| `layout/game-stage/` | Persistent stage strip (messages, sprites, power-up status) |
| `layout/factory-grid/` | Main factory grid |
| `layout/navigation/` | Mobile + desktop nav |

## Neighbors

- Reads from: `store/`, `game/` (can*), `content/` (lists), `i18n/`, `providers/sound`, `providers/variant-tools` (dev A–D for future components)
- Consumed by: `app/page.tsx`

## Evolution

- 2026-06-08 — `layout/game-stage/` replaces `active-power-up` (GameStage orchestrator + power-up slice)
- 2026-06-08 — `ui/box-border/` elevation utility (renamed from `bottom-shadow`); UpgradeCard fixed to preset D (no variant-tools)
- 2026-06-08 — `variant-tools` fixed top-right; `action-tools` bottom ActionBar
- 2026-06-08 — ResponsiveTooltip (Tooltip ≥768px, ToggleTooltip below)
- 2026-06-08 — Royal Codex wiki dialog opened from Settings (gods, figures, upgrades, tips)
