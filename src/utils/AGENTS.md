# utils/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Cross-cutting pure functions — large-decimal arithmetic and display formatting.

## Do

- Keep functions pure with no side effects
- Use `break_infinity.js` via `D` wrapper in `decimal.ts`
- Serialize/deserialize for persistence (`serializeDecimal`, `deserializeDecimal`)
- Tests in `tests/utils/*.test.ts` for all non-trivial logic
- Put number formatting for UI in `formatters.ts`

## Don't

- Import React, store, or i18n
- Put game logic (costs, yields) here — that belongs in `game/`
- Use `any` — prefer `GameValue` / `Decimal`
- Duplicate formatting in components

## Patterns

- `decimal.ts`: `GameValue` type, `D()` helpers, serialize, comparisons
- `formatters.ts`: `formatGold`, `formatRate`, etc. for display
- Vitest node environment

## Key files

| File | Role |
|------|------|
| `decimal.ts` | Break Infinity wrapper, serialize, operations |
| `formatters.ts` | Value formatting for UI |
| `tests/utils/decimal.test.ts` | Arithmetic tests |
| `tests/utils/formatters.test.ts` | Formatting tests |

## Neighbors

- Reads from: `break_infinity.js` only
- Consumed by: `game/`, `store/`, `components/`

## Evolution

- 2026-06-07 — Initial docs: decimal + formatters
