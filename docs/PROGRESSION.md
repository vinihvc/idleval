# Progression and difficulty

> **Maintenance:** Update this file whenever you change progression-related tuning: `GAME_DIFFICULTY`, `GAME_BALANCE`, `PROGRESS_EASE`, `GOD_DATA` (costs, `productionMultiplier`, `productionSpeedMultiplier`), `FACTORY_DATA`, mission gold rewards, or offline/production timing. After code changes, refresh tables using [`src/game/progression-estimates.ts`](../src/game/progression-estimates.ts) and `pnpm test src/game/progression-estimates.test.ts`.

Idleval layers difficulty so early play hooks the player and later god invokes stay challenging.

## Difficulty knobs (three layers)

| Layer | File | What it does |
|-------|------|----------------|
| **Global** | [`src/config/game.ts`](../src/config/game.ts) `GAME_DIFFICULTY` | Scales all costs (`1/d`) and income (`d`). `1` = baseline. Not persisted. |
| **Static balance** | [`src/config/balance.ts`](../src/config/balance.ts) `GAME_BALANCE` | Mild rebalance on catalog baselines (production, costs, god thresholds, missions). |
| **Dynamic progress** | [`src/config/progress-ease.ts`](../src/config/progress-ease.ts) `PROGRESS_EASE` | Early factory boost until 1st god; per-god invoke cost curve. |

**Scaling order:** `content/` baseline → `GAME_BALANCE` → `applyDifficulty(...)` (global and/or progress ease).

### Progress ease (dynamic)

**Factories (before 1st god invoked):**

- `factoryDifficulty` starts at **1.30** (+30% income, ~23% lower costs) when no factory milestones are recorded.
- Decays linearly with factory milestones (unlock / upgrade / automate) and reaches **1.0** at ~45% of max factory progress score.
- **Immediately 1.0** after the first god is invoked.

**God invoke cost (by god index):**

- Index `0` (Huangdi): difficulty **1.15** → ~13% cheaper than balance-adjusted baseline.
- Index `5` (Inti): difficulty **0.70** → ~43% more expensive than baseline.
- Curve: `log₂(1 + index)` normalized across `GOD_COUNT`.

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
| Grain | 2 | 30 | — | 5 610 | 25 500 | 15.0 |
| Wine | 5 | 240 | 15 000 | 44 880 | 204 000 | 48.0 |
| Iron | 9 | 1 920 | 150 000 | 374 000 | 1 700 000 | 213.3 |
| Crossbow | 18 | 15 360 | 1 000 000 | 2 992 000 | 13 600 000 | 853.3 |
| Longship | 36 | 122 880 | 12 500 000 | 29 920 000 | 136 000 000 | 3 413.3 |
| Reliquary | 72 | 983 040 | 125 000 000 | 306 680 000 | 1 394 000 000 | 13 653.3 |

### Early ease (`factoryDifficulty = 1.30`, first run)

| Factory | Value / cycle | Unlock | Manager | Gold/s (1 unit) |
|---------|---------------|--------|---------|-----------------|
| Grain | 39 | — | 4 315 | 19.5 |
| Wine | 312 | 11 538 | 34 523 | 62.4 |

## God invoke thresholds

From [`getGodInvokeThresholds()`](../src/game/progression-estimates.ts) — balance × `godGoldRequired` (0.8) × `getGodInvokeDifficulty(index)`:

| God | Balance only (×0.8) | Invoke difficulty | **Effective threshold** |
|-----|---------------------|-------------------|-------------------------|
| Huangdi | 8.0e11 | 1.15 | **~6.96e11** |
| Dagda | 8.0e17 | ~0.97 | **~8.25e17** |
| Shango | 8.0e23 | ~0.88 | **~9.09e23** |
| Indra | 8.0e29 | ~0.81 | **~9.88e29** |
| Tangaroa | 8.0e35 | ~0.75 | **~1.07e36** |
| Inti | 8.0e41 | 0.70 | **~1.14e42** |

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
| Grain manager | ~4–6 min |
| Unlock wine | ~6–10 min |
| **1st god (Huangdi)** | **2–3.5 h** |
| 2nd → 6th gods | Each run longer (higher threshold, stacked bonuses help rebuild) |
| **All six gods** | **~1–2 weeks** focused active play |

God invoke pacing accelerates rebuild via stacked gold **and** speed, but later invoke costs (log curve) require larger economy jumps.

## How to recompute after a balance change

1. Adjust constants in `config/` or `content/`.
2. Update [`src/game/progression-estimates.ts`](../src/game/progression-estimates.ts) if simulation logic changed.
3. Run `pnpm test src/game/progression-estimates.test.ts` and refresh tables in this doc.
4. Note the change in [`src/game/AGENTS.md`](../src/game/AGENTS.md) Evolution.

## Related code

| Module | Role |
|--------|------|
| [`game/progress-ease.ts`](../src/game/progress-ease.ts) | Factory ease + god invoke difficulty |
| [`game/gods.ts`](../src/game/gods.ts) | Gold/speed multipliers, invoke thresholds |
| [`game/factories.ts`](../src/game/factories.ts) | Yield, unlock prices, gold/s |
| [`game/economy.ts`](../src/game/economy.ts) | Unit/manager/upgrade costs |
| [`game/missions.ts`](../src/game/missions.ts) | Quest progress, slots, renown, god-cycle scaling |
| [`store/atoms/progress-ease.ts`](../src/store/atoms/progress-ease.ts) | Live factory difficulty from save |
