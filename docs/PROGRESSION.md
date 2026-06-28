# Progression and difficulty

> **Maintenance:** Update this file whenever you change progression-related tuning: `GAME_DIFFICULTY`, `GAME_BALANCE`, `PROGRESS_EASE`, `GOD_DATA` (costs, `productionMultiplier`, `productionSpeedMultiplier`), `FACTORY_DATA`, mission gold rewards, or offline/production timing. After code changes, refresh tables using [`src/game/progression-estimates.ts`](../src/game/progression-estimates.ts) and `pnpm test tests/game/progression-estimates.test.ts`.

Idleval layers difficulty so early play hooks the player and later god invokes stay challenging.

## Difficulty knobs (three layers)

| Layer | File | What it does |
|-------|------|----------------|
| **Global** | [`src/config/game.ts`](../src/config/game.ts) `GAME_DIFFICULTY` | Scales all costs (`1/d`) and income (`d`). `1` = baseline. Not persisted. |
| **Static balance** | [`src/config/balance.ts`](../src/config/balance.ts) `GAME_BALANCE` | Mild rebalance on catalog baselines (production, costs, god thresholds, missions). |
| **Dynamic progress** | [`src/config/progress-ease.ts`](../src/config/progress-ease.ts) `PROGRESS_EASE` | Flat factory income/cost boost; mission god-cycle scaling. |

**Scaling order:** `content/` baseline → `GAME_BALANCE` → `applyDifficulty(...)` (global and/or progress ease).

### Progress ease

**Factories:**

- `PROGRESS_EASE.factory.difficulty` (**1.30**) — flat +30% income and ~23% lower factory costs for the whole run (no milestone decay, no change after invoking gods).

**God invoke thresholds:**

- Scaled only by `GAME_BALANCE.godGoldRequired` (1.05) — same multiplier for every god index (no per-god discount curve).

**God permanent bonuses (after invoke, stack multiplicatively):**

| God | Gold / cycle | Production speed |
|-----|--------------|------------------|
| Huangdi | ×2 | ×1.15 |
| Dagda | ×3 | ×1.25 |
| Shango | ×4 | ×1.35 |
| Indra | ×5 | ×1.50 |
| Tangaroa | ×8 | ×1.65 |
| Inti | ×10 | ×1.80 |

Speed and gold bonuses **accumulate** across all invoked gods. Invoking a god **resets** gold, factory units, and **missions** (including renown). Mission objectives and gold rewards scale by `PROGRESS_EASE.mission.cycleBase ** godsInvoked` (default ×2 per invoked god).

### Mission god-cycle scaling

| Gods invoked | Cycle multiplier | Example: earn 1 500 gold objective | Example: 750 gold reward (before `GAME_BALANCE`) |
|--------------|------------------|-------------------------------------|--------------------------------------------------|
| 0 | ×1 | 1 500 | 750 |
| 1 | ×2 | 3 000 | 1 500 |
| 2 | ×4 | 6 000 | 3 000 |
| 6 | ×64 | 96 000 | 48 000 |

Scaled at runtime in [`game/missions.ts`](../src/game/missions.ts) — catalog baselines unchanged. `ownUnits` progress counts units purchased **since the last god invoke** (baseline captured in `ownUnitsBaselines`). Binary objectives (unlock/upgrade/automate factory) are not scaled.

Effective cycle time: `(baseTime × hasteRune) / cumulativeGodSpeed`.

## Per-factory reference (balance-adjusted, `factoryDifficulty = 1`)

From [`getFactoryReferenceMetrics(1)`](../src/game/progression-estimates.ts):

| Factory | Cycle (s) | Value / unit / cycle | Unlock gold | Manager | Upgrade | Gold/s (1 unit) |
|---------|-----------|----------------------|-------------|---------|---------|-----------------|
| Grain | 2 | 45 | — | 5 610 | 25 500 | 22.5 |
| Wine | 4 | 360 | 15 000 | 44 880 | 204 000 | 90.0 |
| Iron | 8 | 2 880 | 150 000 | 374 000 | 1 700 000 | 360.0 |
| Crossbow | 16 | 23 040 | 1 000 000 | 2 992 000 | 13 600 000 | 1 440.0 |
| Longship | 32 | 184 320 | 12 500 000 | 29 920 000 | 136 000 000 | 5 760.0 |
| Reliquary | 65 | 1 474 560 | 125 000 000 | 306 680 000 | 1 394 000 000 | 22 670.8 |

### Early ease (`factoryDifficulty = 1.30`)

| Factory | Value / cycle | Unlock | Manager | Gold/s (1 unit) |
|---------|---------------|--------|---------|-----------------|
| Grain | 58.5 | — | 4 315 | 29.3 |
| Wine | 468 | 11 538 | 34 523 | 117.0 |

## God invoke thresholds

From [`getGodInvokeThresholds()`](../src/game/progression-estimates.ts) — balance × `godGoldRequired` (1.05):

| God | **Effective threshold** |
|-----|-------------------------|
| Huangdi | **1.05×10¹²** |
| Dagda | **1.05×10¹⁸** |
| Shango | **1.05×10²⁴** |
| Indra | **1.05×10³⁰** |
| Tangaroa | **1.05×10³⁶** |
| Inti | **1.05×10⁴²** |

### Cumulative god bonuses (in order)

| After invoking | Gold mult | Speed mult |
|----------------|-----------|------------|
| Huangdi | ×2 | ×1.15 |
| + Dagda | ×6 | ×1.44 |
| + Shango | ×24 | ×1.94 |
| All 6 | ×11 520 | ×~6.5 |

## Reference play timing (active, no missions/power-ups)

From [`estimateMilestoneMinutes()`](../src/game/progression-estimates.ts). Conservative band for docs; real runs vary with offline, missions, and purchase rhythm.

| Milestone | Approx. active time |
|-----------|---------------------|
| Grain manager | ~3–4 min |
| Unlock wine | ~4–7 min |
| **1st god (Huangdi)** | **1.7–3 h** |
| 2nd → 6th gods | Each run longer (higher threshold, stacked bonuses help rebuild) |
| **All six gods** | **~5–9 days** focused active play |

God invoke pacing accelerates rebuild via stacked gold **and** speed, but later invoke costs (log curve) require larger economy jumps.

## How to recompute after a balance change

1. Adjust constants in `config/` or `content/`.
2. Update [`src/game/progression-estimates.ts`](../src/game/progression-estimates.ts) if simulation logic changed.
3. Run `pnpm test tests/game/progression-estimates.test.ts` and refresh tables in this doc.
4. Note the change in [`src/game/AGENTS.md`](../src/game/AGENTS.md) Evolution.

## Related code

| Module | Role |
|--------|------|
| [`game/progress-ease.ts`](../src/game/progress-ease.ts) | Flat factory difficulty boost |
| [`game/gods.ts`](../src/game/gods.ts) | Gold/speed multipliers, invoke thresholds |
| [`game/factories.ts`](../src/game/factories.ts) | Yield, unlock prices, gold/s |
| [`game/economy.ts`](../src/game/economy.ts) | Unit/manager/upgrade costs |
| [`game/missions.ts`](../src/game/missions.ts) | Quest progress, slots, renown, god-cycle scaling |
| [`store/atoms/progress-ease.ts`](../src/store/atoms/progress-ease.ts) | Re-exports factory difficulty for store |
