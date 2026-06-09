# game/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Pure, testable logic — formulas, eligibility, offline simulation, no UI or strings.

## Do

- Write pure functions that take state + data from `content/`
- Colocate tests `*.test.ts` with Vitest (`environment: node`)
- Add `@example` JSDoc on public exports
- Use `D` / `GameValue` from `@/utils/decimal` for large numbers
- Use `beforeEach(() => setDifficulty("medium"))` when difficulty affects the test

## Don't

- Import React, `i18n/`, or `components/`
- Return display strings — return numbers, booleans, IDs
- Duplicate data from `content/` — import `FACTORY_DATA` / `GOD_DATA`
- Persist state — that belongs in `store/`

## Patterns

- Modules by domain: `economy.ts`, `factories.ts`, `gods.ts`, `purchases.ts`, `offline-earning.ts`, `difficulty.ts`
- Persisted state shapes in `types.ts`
- Only store exception: `getDifficultyLevel` / `setDifficulty` from `store/atoms/settings`

## Key files

| File | Role |
|------|------|
| `economy.ts` | Costs, price scaling |
| `factories.ts` | Yield, upgrade/unlock eligibility |
| `gods.ts` | Multipliers, invocation rules |
| `purchases.ts` | Buy modes (1, 10%, 50%, max) |
| `offline-earning.ts` | Offline earnings simulation |
| `types.ts` | Persisted state shapes |

## Neighbors

- Reads from: `content/`, `utils/decimal`, `store/atoms/settings` (difficulty)
- Consumed by: `store/` (actions), `components/` (can* checks)

## Evolution

- 2026-06-07 — Initial docs: pure logic + colocated tests
