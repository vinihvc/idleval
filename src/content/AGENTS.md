# content/

> Parent: [src/AGENTS.md](../AGENTS.md) · Stack: Vite + React 19 + Jotai + Paraglide + Ark UI

## Purpose

Declarative game catalog — IDs, numeric balance, assets, and localization bridges.

## Do

- Define data in constants (`FACTORY_DATA`, `GOD_DATA`) with `as const` where applicable
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
- Files: `factories.ts`, `gods.ts`
- Tests: `content.invariants.test.ts` (structure + `hasMessageKey`)

## Key files

| File | Role |
|------|------|
| `factories.ts` | `FACTORY_DATA`, types, localized getters |
| `gods.ts` | `GOD_DATA`, `GodId`, progression constants |
| `content.invariants.test.ts` | Structural invariants + i18n key coverage |

## Neighbors

- Reads from: `i18n/localize` only
- Consumed by: `game/`, `store/`, `i18n/hooks/`, `components/`

## Evolution

- 2026-06-07 — Initial docs: catalog + localize bridge + invariants
