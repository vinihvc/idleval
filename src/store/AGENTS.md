# store/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Global Jotai state — persistence, mutations, and selectors; orchestrates `game/` without duplicating rules.

## Do

- Persist via `persistedAtom(key, initial)` from `storage.ts`
- Mutations as imperative functions (`store.set`/`store.get`), not write-only atoms
- Export `get*` (imperative) + `use*` (React) for reads
- Split large domains: `factories.{atom,actions,selectors}.ts` + barrel `factories.ts`
- Store gold/decimals as serialized strings (`serializeDecimal`/`deserializeDecimal`)
- Use `beforeEach(() => resetGame())` in tests; seed via `test-utils.ts`
- Use `selectAtom` + `Map` cache for granular subscriptions

## Don't

- Inline economy rules — call `@/game/*`
- Use `atomWithStorage` directly — use `persistedAtom`
- Add barrel files at the store root
- Import components or i18n strings
- Change storage keys without a version suffix when schema changes (e.g. `wallet-v4`)

## Patterns

- Atoms: `{domain}Atom`; hooks: `use{Domain}`; getters: `get{Thing}`
- Reset: `resetRunProgress()` (run) vs `resetGame()` (full wipe)
- Colocated tests `*.test.ts`; `vi.mock("@/providers/sound")` when actions trigger audio
- Explicit imports: `@/store/atoms/factories`, `@/store/reset`

## Key files

| File | Role |
|------|------|
| `storage.ts` | `persistedAtom`, in-memory fallback for SSR/test |
| `reset.ts` | `resetGame()` — full wipe |
| `reset-run-progress.ts` | Run reset (partial prestige) |
| `offline.ts` | `applyOfflineEarnings`, `offlineSummaryAtom`, `offlineCycleProgressAtom` |
| `atoms/session.ts` | Persisted `lastSeenAt`, `touchLastSeen*` helpers |
| `test-utils.ts` | `seedGold`, `seedFactory`, `setupStoreTest` |
| `atoms/factories.actions.ts` | Purchases, production, upgrades |
| `atoms/wallet.ts` | Gold balance |
| `atoms/settings.ts` | Difficulty, locale, volumes |

## Neighbors

- Reads from: `game/`, `content/`, `utils/`, `providers/store` (singleton)
- Consumed by: `components/`, `hooks/`, `providers/`, `i18n/`

## Evolution

- 2026-06-08 — Offline state consolidated in `offline.ts`; `session.ts` is lastSeenAt only
- 2026-06-07 — Initial docs: persistedAtom, actions/selectors, resetGame
