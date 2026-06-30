# game/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Pure, testable logic — formulas, eligibility, offline simulation, no UI or strings.

## Do

- Write pure functions that take state + data from `content/`
- Add tests in `tests/game/*.test.ts` (Vitest `environment: node`)
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
| `balance.ts` | `BALANCE_BASELINE` scaling helpers for factories, gods |
| `difficulty.ts` | `GAME_BALANCE` scaling for costs and income |
| `factories.ts` | Yield, eligibility, initial factory state, gold/s rate |
| `gods.ts` | Multipliers, invocation rules, `hasInvokableGod` |
| `power-ups.ts` | Buffs, daily rewards, inventory slots, realm economy |
| `purchases.ts` | Buy modes (1, 10%, 50%, max) |
| `offline-earning.ts` | Offline earnings simulation |
| `manual-production.ts` | Manual cycle reconcile by wall-clock timestamp |
| `factory-cycle.ts` | Wall-clock cycle anchors (`cycleEndsAt`) for scheduler + progress UI |
| `player-level.ts` | Derived player level 1–100 from wallet + gods |
| `missions/level-scaling.ts` | Mission objective/gold/power-up scaling by level |
| `mission-progression.ts` | Catalog-order wallet simulation for balance checks |
| `progress-ease.ts` | Flat factory difficulty boost |
| `progression-estimates.ts` | Milestone timing estimates for docs/PROGRESSION.md |
| `types.ts` | Persisted state shapes |

## Neighbors

- Reads from: `content/`, `config/balance`, `utils/decimal`
- Consumed by: `store/` (actions), `components/` (can* checks)

## Evolution

- 2026-06-30 — Player level 1–100 from wallet + gods; mission scaling replaces god-cycle multiplier
- 2026-06-30 — Aggressive ease rebalance: `GAME_BALANCE` 1.5; `productionValue` 2.85; `unitCostGrowth` 1.024; `godGoldRequired` 0.60; progress ease 1.55
- 2026-06-30 — `GAME_BALANCE` is a single difficulty number; tuned constants moved to `BALANCE_BASELINE`; removed `GAME_DIFFICULTY`
- 2026-06-27 — Simplified progress ease: flat `factory.difficulty` 1.3; removed milestone decay and per-god invoke cost curve
- 2026-06-27 — Pre-god engagement: `unitCostGrowth` 1.03; `godGoldRequired` 1.05
