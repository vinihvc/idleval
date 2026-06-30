# Idleval — AI Context

Architecture guide and feature recipes for agents. Code conventions (Ultracite, a11y, sprites) live in [AGENTS.md](../AGENTS.md). Folder map and import rules: [src/AGENTS.md](../src/AGENTS.md). Visual identity and UI patterns: [DESIGN.md](./DESIGN.md).

## What it is

Fantasy idle game (Vite + React 19). Global state in **Jotai** persisted to **localStorage**. Pure business rules in **`game/`**; static catalog in **`content/`**; UI in **`components/`**.

## Layers and imports

```
content (IDs, numbers) → game (rules) → store (state) → components (UI)
                              ↑                    ↑
                         i18n (strings)      hooks/providers (effects)
```

| Folder | May import | Must not import |
|--------|------------|-----------------|
| `content/` | `i18n/localize` | `game/`, `store/`, React |
| `game/` | `content/`, `utils/`, `store/atoms/settings` | `i18n/`, React, `components/` |
| `store/` | `game/`, `content/`, `utils/` | `components/`, i18n |
| `components/` | layers above + `hooks/`, `providers/` | inline business logic |

**Before editing:** read `src/AGENTS.md` + `src/{folder}/AGENTS.md` for the target folder.  
**Before editing UI:** read [DESIGN.md](./DESIGN.md).

## Game domains

| Domain | content | game | store | UI / providers |
|--------|---------|------|-------|----------------|
| Factories | `factories.ts` | `factories.ts`, `economy.ts`, `purchases.ts` | `atoms/factories.*` | `ui/factory-card/`, `game/factory-grid/` |
| Gods | `gods.ts` | `gods.ts` | `atoms/gods.*` | `dialog/gods/` |
| Power-ups | `power-ups.ts` | `power-ups.ts` | `atoms/power-ups.*`, `atoms/inventory.ts` | `ui/power-up/`, `dialog/inventory/`, `dialog/wiki/` |
| Missions | `missions.ts` | `missions.ts` | `atoms/missions.*` | `game/missions/`, `dialog/mission/` |
| Offline | — | `offline-earning.ts` | `offline-earning.ts`, `atoms/session.ts` | `providers/offline-earning/`, `dialog/offline-earning/` |
| Settings | — | — | `atoms/settings.ts` | `dialog/settings/` |

## Fixed decisions

- **Decimals:** `GameValue` / `D` from `@/utils/decimal` — never `number` for scaled gold.
- **Balance / difficulty:** `GAME_BALANCE` in `@/config/balance.ts` (`1` = normal; `>1` easier, `<1` harder). `BALANCE_BASELINE` holds tuned constants at balance `1`. Applied in `game/balance.ts` and `game/difficulty.ts` — not persisted, not player-facing.
- **Progress ease:** `PROGRESS_EASE` in `@/config/progress-ease.ts` — flat factory difficulty boost; mission god-cycle scaling; see `game/progress-ease.ts`. Document pacing in [PROGRESSION.md](./PROGRESSION.md) whenever these knobs change.
- **Persistence:** `persistedAtom` / `persistedAtomWithNormalize` from `store/storage.ts`; stable keys in `@/config/local-storage` (`LOCAL_STORAGE`); evolve schema via `normalize` on read — never version-bump keys.
- **Mutations:** imperative functions (`store.get` / `store.set`), not write-only atoms.
- **Single-consumer hooks:** colocate in component or provider folder (`factory-card/use-*.ts`, `providers/offline-earning/`).
- **Shared hooks:** only in `src/hooks/` when 2+ unrelated consumers need them.
- **i18n:** UI strings via `m["ui.*"]()`; entities via `getLocalized*` in `content/`; add **en, es, pt**.
- **Dialogs:** `useDialogOpen(id)` + `setDialogOpen`; `ResponsiveDialog`; lazy with `<Suspense>`.
- **No barrel files** at the `store/` root.

## Recipes

### New cross-layer feature (template)

1. **`content/`** — `as const` constant, derived types, localized getters, i18n keys, extend `tests/content/content.invariants.test.ts`.
2. **`game/`** — pure functions + tests in `tests/game/` (Vitest node); shapes in `types.ts` if persisted.
3. **`store/atoms/`** — `{domain}.atom.ts`, `.actions.ts`, `.selectors.ts`, barrel `{domain}.ts`; key in `LOCAL_STORAGE`.
4. **`components/`** or **`providers/`** — UI/effects; browser tests with `renderWithProviders`; follow [DESIGN.md](./DESIGN.md).
5. **Docs** — update `AGENTS.md` in each touched folder (Evolution section, max 5 entries); update [PROGRESSION.md](./PROGRESSION.md) when pacing/difficulty tuning changes.

Verify: `pnpm test` on touched files, `pnpm i18n:check` for new keys, `pnpm dlx ultracite fix`.

### Missions (reference)

End-to-end flow already implemented — use as a model for progress + reward features.

| Layer | Files | Responsibility |
|-------|-------|----------------|
| content | `missions.ts` | `MISSION_DATA`, types, `getLocalizedMission` |
| game | `missions.ts`, `types.ts` | snapshot, slots, progress, renown multiplier |
| store | `missions.atom/actions/selectors.ts`, `missions.ts` | persist `missions`, claim, sync, selectors |
| UI stage | `game/missions/missions.tsx`, `missions.card.tsx` | visible slots on stage |
| UI dialog | `dialog/mission/mission.tsx`, `mission.content.tsx` | claim flow |

Key actions: `syncMissionProgress`, `claimMissionReward`, `incrementMissionCounter`. Selectors: `useVisibleMissionSlots`, `getHasClaimableMission`.

### New domain dialog

1. Create folder `components/dialog/{name}/` with `{name}.tsx` + content/card as needed.
2. Register dialog id in `store/atoms/dialogs.ts` if applicable.
3. Trigger at call site with `toggleDialog(id)` — **outside** `Suspense`.
4. Content uses `ResponsiveDialog`, `DialogTitle`, `ResponsiveDialogDescription`, `m["ui.*"]()`.
5. Lazy-load: `<Suspense fallback={null}>` around the dialog only.
6. Test with `getByRole` + i18n labels.

See [src/components/AGENTS.md](../src/components/AGENTS.md) and [DESIGN.md](./DESIGN.md).

### New factory

1. `content/factories.ts` — `FACTORY_DATA` entry, i18n `factory.{id}.*`.
2. `game/factories.ts` — yield, unlock, upgrade rules.
3. Store already covers via `factories.*` — extend actions/selectors if needed.
4. UI: `factory-card` composes existing data; grid in `game/factory-grid/`.
5. `tests/content/content.invariants.test.ts` — monotonic prices, i18n keys.

### New power-up

1. `content/power-ups.ts` — catalog + effects constants.
2. `game/power-ups.ts` — effects, duration, eligibility.
3. `store/atoms/power-ups.*` + `inventory.ts` for slots/altars.
4. UI: `ui/power-up/`, wiki tab in `dialog/wiki/`, sprite in `public/images/power-ups/` (magenta pipeline — see root AGENTS.md).
5. Tests: `tests/game/power-ups.test.ts`, `tests/store/atoms/power-ups.actions.test.ts`.

### Daily ritual reward

1. `content/daily-reward.ts` — fixed calendar.
2. `game/daily-reward.ts` — streak, pending, offer.
3. `store/atoms/daily-reward.*` — persisted streak (separate from inventory).
4. UI: `dialog/daily-reward/`; claim grants power-ups via `addInventorySlot`.
5. Tests: `tests/game/daily-reward.test.ts`, `tests/store/atoms/daily-reward.actions.test.ts`.

### Offline / scheduler

Global effects live in **`providers/offline-earning/`** (not root `hooks/`):

- `use-offline-earning.ts` — session heartbeat, tab visibility, apply offline
- `use-production-scheduler.ts` — production tick; calls `refreshExpiredPowerUps` each interval
- `production-scheduler-sync.ts` — testable pure logic

Pure rules in `game/offline-earning.ts`; apply in `store/offline-earning.ts`.

## Useful commands

```bash
pnpm dev
pnpm test
pnpm typecheck
pnpm test tests/game/missions.test.ts
pnpm i18n:check
pnpm dlx ultracite fix
pnpm dlx ultracite check
```

## Anti-patterns

- Import `i18n/` or React in `game/`
- `useAtomValue` outside accessor hooks in `store/atoms/`
- Hardcoded strings in JSX
- Inline economy rules in `store/` or `components/`
- `useEffect` in `store/atoms/*` — move to `providers/` or `hooks/`
- Create `AGENTS.md` in component subfolders — update the parent folder's AGENTS.md
- Raw hex/OKLCH colors in TSX — use tokens from [DESIGN.md](./DESIGN.md)
