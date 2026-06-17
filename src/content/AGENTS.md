# content/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Declarative game catalog — IDs, numeric balance, assets, and localization bridges.

## Do

- Define data in constants (`FACTORY_DATA`, `GOD_DATA`, `MISSION_DATA`) with `as const` where applicable — numbers are **design baselines**; runtime tuning is `GAME_BALANCE` in `@/config/balance.ts` via `game/balance.ts`
- Export derived types (`FactoryType`, `GodId`, `FACTORY_TYPES`)
- Resolve strings via `getLocalizedFactory()` / `getLocalizedGod()` using `@/i18n/localize`
- Add i18n keys in all locales when creating a new entity
- Extend `content.invariants.test.ts` for new entities

## Don't

- Put game rules (affordability, yield, prestige) here — those go in `game/`
- Import `store/`, `game/`, or React
- Add generic UI strings — only entity lore/names
- Use negative values or non-monotonic unlock prices (breaks invariants)

## Patterns

- i18n keys: `{entity}.{id}.{field}` (e.g. `factory.grain.name`)
- Mission module: `missions/types.ts`, `missions/catalog.ts`, `missions/catalog-helpers.ts`, `missions/localize.ts` — barrel `missions.ts`
- Tests: `content.invariants.test.ts`, `missions.localization.test.ts`

## Key files

| File | Role |
|------|------|
| `factories.ts` | `FACTORY_DATA`, types, localized getters |
| `gods.ts` | `GOD_DATA`, `GodId`, `getGodIndex`, localized getters |
| `power-ups.ts` | Relic catalog, `POWER_UP_EFFECTS`, localized getters |
| `daily-reward.ts` | Fixed daily reward calendar |
| `missions.ts` | Barrel for mission catalog + localization |
| `content.invariants.test.ts` | Structural invariants + i18n key coverage |

## Neighbors

- Reads from: `i18n/localize`, `@/config/balance` (power-up effect constants only)
- Consumed by: `game/`, `store/`, `i18n/hooks/`, `components/`

## Evolution

- 2026-06-17 — Quality pass: `getGodIndex`, mission invariant coverage, power-up param dedup; `@reserved` on unused mission schema fields
- 2026-06-17 — `GOD_DATA.productionSpeedMultiplier`; `power-ups.ts` reads `GAME_BALANCE`; 200-mission catalog
- 2026-06-14 — `missions.ts` hardcoded `MISSION_DATA` catalog (100 quests)
- 2026-06-08 — `power-ups.ts` catalog with fixed daily calendar and altar grid
- 2026-06-07 — Initial docs: catalog + localize bridge + invariants
