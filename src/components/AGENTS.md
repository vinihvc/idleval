# components/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI  
> Visual design: [docs/DESIGN.md](../../docs/DESIGN.md) · Architecture: [docs/CONTEXT.md](../../docs/CONTEXT.md)

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
- Extract Tailwind/CSS class strings into variables (`const fooClasses = "flex gap-2"`). Put classes on the element's `className` (inline or via `cn()` at the call site). Use `tv()` for variants and design-system helpers (`boxBorder`, `borderedText`) for shared presets

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
- Colocate `use-*.ts` in the component folder when only that component (or its subfiles) consumes the hook — e.g. `factory-card/use-factory-card.ts`, `upgrade-card/use-upgrade-card-affordance.ts`

## Subfolders

| Subfolder | Role |
|-----------|------|
| `ui/` | Design-system primitives (`text-border`, button, dialog, drawer, …) |
| `ui/factory-card/`, `ui/upgrade-card/` | Composites with provider + dot-notation subfiles |
| `dialog/` | Domain overlays (`settings/`, `wiki/`, `upgrades/`, `managers/`, `gods/`, `inventory/`, `missions/`, `offline-earning/`) |
| `game/` | Game shell: `shell/`, `panel/`, `stage/`, `factory-grid/`, `missions/` |
| `layout/` | Chrome: `header/`, `navigation/`, `footer/`, `background/` |
| `icons/` | Custom SVGs (`coin`, `logo`, `wax-seal`) |
| `debug/` | Dev-only (`variant-tools` fixed top-right, `action-tools` bottom bar, `media-query`, `factories-state-dialog`) |

## Key files

| File | Role |
|------|------|
| `ui/responsive-dialog/` | Adaptive Dialog/Drawer (768px breakpoint) |
| `ui/responsive-tooltip/` | Adaptive Tooltip/ToggleTooltip (768px breakpoint) |
| `game/stage/` | Persistent stage strip (messages, sprites, power-up status) |
| `game/missions/` | Mission slots on stage (`mission-slots`, `mission-objective`) |
| `dialog/mission/` | Mission claim dialog |
| `game/factory-grid/` | Main factory grid |
| `layout/navigation/` | Mobile + desktop nav |

## Neighbors

- Reads from: `store/`, `game/` (can*), `content/` (lists), `i18n/`, `providers/sound`, `providers/variant-tools` (dev A–D for future components)
- Consumed by: `app/page.tsx`

## Evolution

- 2026-06-15 — `factories-state-dialog` dev JSON inspector for `factoriesAtom`
- 2026-06-15 — `game/missions/` consolidated to `mission-objective.tsx` + `mission-slots.tsx`
- 2026-06-15 — Ban module-level Tailwind class string variables; inline on className or use tv()/helpers
- 2026-06-14 — Mission UI: stage slots + `dialog/mission/` claim flow
- 2026-06-13 — Domain dialog open state centralized in `store/atoms/dialogs`; triggers stay outside dialog wrappers and Suspense
