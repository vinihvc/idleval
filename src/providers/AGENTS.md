# providers/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

React context providers and Jotai singleton — global application wiring.

## Do

- Export `StoreProvider` + singleton `store` from `store.tsx`
- Keep nesting order in `app/providers.tsx`
- `SoundProvider`: bridge between `audio/engine` and `settingsAtom`
- `OfflineEarning`: global game side effects (offline apply, production loop, power-ups)
- Use `React.createContext` + `useXxx` hook that throws outside the provider

## Don't

- Put complex business logic here — delegate to `game/` and `store/` actions
- Define new atoms here — put them in `store/atoms/`
- Use conditional providers that break the tree in production
- Import UI components

## Variant tools (`variant-tools.tsx`)

Use this for **future** A/B/C/D comparisons of new UI (not UpgradeCard — fixed preset D).

| Export | Use |
|--------|-----|
| `VARIANT_TOOLS` | Const array `["a", "b", "c", "d"]` — shared with debug UI |
| `VariantTools` | Type `"a" \| "b" \| "c" \| "d"` — defined here, not in upgrade-card |
| `VariantToolsProvider` | Already in `app/providers.tsx` — do not duplicate |
| `useVariantTools()` | Context: `variant`, `setVariant` |
| `usePickVariantTools(presets)` | `presets[activeVariant]` from a `Record<VariantTools, T>` |
| `useIsVariantTools("a")` | Boolean guard for one variant |

**Dev switching:** UI `components/debug/variant-tools.tsx` (top-right) + keys **1** → a, **2** → b, **3** → c, **4** → d (`keydown` in provider, `IS_DEV` only). Choice persists via `useLocalStorage` (`LOCAL_STORAGE_KEYS.openCardVariant`).

**Agent rule:** Implement variations as keyed presets + these hooks — never one-off toggles or four duplicate components.

## Patterns

- One file per provider
- `store` exported for imperative access (`store.get`, `store.set`) in actions and tests
- Effects in `useEffect` with explicit cleanup

## Key files

| File | Role |
|------|------|
| `store.tsx` | `createStore()`, `StoreProvider`, export `store` |
| `sound.tsx` | `SoundProvider`, `useSound()`, volumes + play API |
| `offline-earning.tsx` | `useOfflineEarning` + `useProductionScheduler` + lazy welcome-back dialog |
| `variant-tools.tsx` | Open-card variant store, context, dev hotkeys (1–4) |

## Neighbors

- Reads from: `store/`, `audio/`, `hooks/`
- Consumed by: `app/providers.tsx`, `store/` actions (singleton)

## Evolution

- 2026-06-08 — Variant tools persist via `useLocalStorage` + `LOCAL_STORAGE_KEYS`
- 2026-06-08 — `variant-tools`: `useState` + native keydown; export `VARIANT_TOOLS`
- 2026-06-08 — `VariantTools` type + hooks replace `OpenVisualVariant` naming
- 2026-06-08 — `OpenVisualVariant` moved here; UpgradeCard decoupled from variant-tools
- 2026-06-08 — Inlined `useProductionScheduler` into `offline-earning.tsx`
