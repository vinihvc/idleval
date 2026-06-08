# providers/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

React context providers and Jotai singleton — global application wiring.

## Do

- Export `StoreProvider` + singleton `store` from `store.tsx`
- Keep nesting order in `app/providers.tsx`
- `SoundProvider`: bridge between `audio/engine` and `settingsAtom`
- `ProductionScheduler` / `OfflineBootstrap`: global game side effects
- Use `React.createContext` + `useXxx` hook that throws outside the provider

## Don't

- Put complex business logic here — delegate to `game/` and `store/` actions
- Define new atoms here — put them in `store/atoms/`
- Use conditional providers that break the tree in production
- Import UI components

## Patterns

- One file per provider
- `store` exported for imperative access (`store.get`, `store.set`) in actions and tests
- Effects in `useEffect` with explicit cleanup

## Key files

| File | Role |
|------|------|
| `store.tsx` | `createStore()`, `StoreProvider`, export `store` |
| `sound.tsx` | `SoundProvider`, `useSound()`, volumes + play API |
| `production-scheduler.tsx` | Global production loop |
| `offline-bootstrap.tsx` | Apply offline earnings on mount |

## Neighbors

- Reads from: `store/`, `audio/`, `hooks/`
- Consumed by: `app/providers.tsx`, `store/` actions (singleton)

## Evolution

- 2026-06-07 — Initial docs: store singleton + sound + scheduler + offline
