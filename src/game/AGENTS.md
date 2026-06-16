# game/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Pure, testable logic — formulas, eligibility, offline simulation, no UI or strings.

## Do

- Write pure functions that take state + data from `content/`
- Colocate tests `*.test.ts` with Vitest (`environment: node`)
- Add `@example` JSDoc on public exports
- Use `D` / `GameValue` from `@/utils/decimal` for large numbers

## Don't

- Import React, `i18n/`, or `components/`
- Return display strings — return numbers, booleans, IDs
- Duplicate data from `content/` — import `FACTORY_DATA` / `GOD_DATA`
- Persist state — that belongs in `store/`

## Patterns

- Modules by domain: `economy.ts`, `factories.ts`, `gods.ts`, `purchases.ts`, `missions.ts`, `offline-earning.ts`
- Persisted state shapes in `types.ts`

## Key files

| File | Role |
|------|------|
| `economy.ts` | Costs, price scaling |
| `factories.ts` | Yield, eligibility, initial factory state, gold/s rate |
| `gods.ts` | Multipliers, invocation rules, `hasInvokableGod` |
| `power-ups.ts` | Buffs, daily rewards, inventory slots, realm economy |
| `purchases.ts` | Buy modes (1, 10%, 50%, max) |
| `offline-earning.ts` | Offline earnings simulation |
| `manual-production.ts` | Manual cycle reconcile by wall-clock timestamp |
| `missions.ts` | Quest progress, slots, renown multiplier |
| `types.ts` | Persisted state shapes |

## Neighbors

- Reads from: `content/`, `utils/decimal`
- Consumed by: `store/` (actions), `components/` (can* checks)

## Evolution

- 2026-06-15 — `manual-production.ts`: persisted cycle timestamps, offline reconcile (max 1 cycle)
- 2026-06-14 — `createInitialFactoriesState`, `canPurchaseAny*`, `getFactoryGoldPerSecond`, `hasInvokableGod` centralized in game layer
- 2026-06-14 — `missions.ts` pure rules for quest progress, slots, and renown
- 2026-06-08 — Removed difficulty system; game layer no longer imports store
- 2026-06-07 — Initial docs: pure logic + colocated tests
