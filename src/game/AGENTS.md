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
| `balance.ts` | `GAME_BALANCE` scaling helpers for factories, gods |
| `difficulty.ts` | `GAME_DIFFICULTY` scaling for costs and income |
| `factories.ts` | Yield, eligibility, initial factory state, gold/s rate |
| `gods.ts` | Multipliers, invocation rules, `hasInvokableGod` |
| `power-ups.ts` | Buffs, daily rewards, inventory slots, realm economy |
| `purchases.ts` | Buy modes (1, 10%, 50%, max) |
| `offline-earning.ts` | Offline earnings simulation |
| `manual-production.ts` | Manual cycle reconcile by wall-clock timestamp |
| `factory-cycle.ts` | Wall-clock cycle anchors (`cycleEndsAt`) for scheduler + progress UI |
| `missions.ts` | Barrel: progress, slots, scaling, rewards |
| `mission-progression.ts` | Catalog-order wallet simulation for balance checks |
| `progress-ease.ts` | Dynamic factory ease + god invoke difficulty by index |
| `progression-estimates.ts` | Milestone timing estimates for docs/PROGRESSION.md |
| `types.ts` | Persisted state shapes |

## Neighbors

- Reads from: `content/`, `config/game`, `config/balance`, `utils/decimal`
- Consumed by: `store/` (actions), `components/` (can* checks)

## Evolution

- 2026-06-17 — `factory-cycle.ts`: wall-clock cycle anchors shared by scheduler and progress bar
- 2026-06-17 — Quality pass: decimal-safe gold progress, `canPurchaseAny*` helper, architecture ban on `@/i18n/` imports
- 2026-06-17 — `missions.ts`: god-cycle reset; `2^godsInvoked` scaling; `progress-ease.ts`, `mission-progression.ts`
- 2026-06-14 — `createInitialFactoriesState`, `canPurchaseAny*`, `getFactoryGoldPerSecond`, `hasInvokableGod`
- 2026-06-08 — Removed difficulty system; game layer no longer imports store
