# Progression and difficulty

> **Maintenance:** Update this file whenever you change progression-related tuning: `GAME_BALANCE`, `PROGRESS_EASE`, `BALANCE_BASELINE`, `PLAYER_LEVEL`, `GOD_DATA` (costs, `productionMultiplier`, `productionSpeedMultiplier`), `FACTORY_DATA`, mission gold rewards, or offline/production timing. After code changes, refresh tables using [`src/game/progression-estimates.ts`](../src/game/progression-estimates.ts) and `pnpm test tests/game/progression-estimates.test.ts`.

Idleval layers difficulty so early play hooks the player and later god invokes stay challenging.

## Difficulty knobs (two layers)

| Layer | File | What it does |
|-------|------|----------------|
| **Global balance** | [`src/config/balance.ts`](../src/config/balance.ts) `GAME_BALANCE` | Single difficulty number: `1` = normal, `>1` easier (more income, lower costs, faster cycles), `<1` harder. `BALANCE_BASELINE` holds tuned constants at `GAME_BALANCE = 1`. Not persisted. |
| **Dynamic progress** | [`src/config/progress-ease.ts`](../src/config/progress-ease.ts) `PROGRESS_EASE` | Flat factory income/cost boost. |
| **Player level** | [`src/config/player-level.ts`](../src/config/player-level.ts) `PLAYER_LEVEL` | Derived level 1–100 from wallet + gods; scales mission objectives and rewards. |

**Scaling order:** `content/` baseline → `BALANCE_BASELINE` → `applyDifficulty(...)` via `GAME_BALANCE` (and/or progress ease).

### Progress ease

**Factories:**

- `PROGRESS_EASE.factory.difficulty` (**1.55**) — flat +55% income and ~35% lower factory costs for the whole run (no milestone decay, no change after invoking gods).

**God invoke thresholds:**

- Scaled by `BALANCE_BASELINE.godGoldRequired` (0.60) then `GAME_BALANCE` (1.5) — same multiplier for every god index (no per-god discount curve).

**God permanent bonuses (after invoke, stack multiplicatively):**

| God | Gold / cycle | Production speed |
|-----|--------------|------------------|
| Huangdi | ×2 | ×1.15 |
| Dagda | ×3 | ×1.25 |
| Shango | ×4 | ×1.35 |
| Indra | ×5 | ×1.50 |
| Tangaroa | ×8 | ×1.65 |
| Inti | ×10 | ×1.80 |

Speed and gold bonuses **accumulate** across all invoked gods. Invoking a god **resets** gold, factory units, and **missions** (including renown). Mission objectives and rewards scale by **player level** (see below), not by a separate god-cycle multiplier.

### Player level (1–100)

Derived at runtime from [`getPlayerLevel(snapshot)`](../src/game/player-level.ts) — **not persisted**.

| Signal | Weight | Range |
|--------|--------|-------|
| Invoked gods | 0–6 → linear | up to **45** points |
| Wallet gold | log₁₀ from 1e3..1e18 | up to **55** points |

**Level** = clamp(round(god points + wallet points), 1, 100).

After a god invoke, wallet resets to 0 but invoked gods increase — level drops on the wallet portion yet keeps a **prestige floor** (~7–8 levels per god).

**Mission scaling** ([`game/missions/level-scaling.ts`](../src/game/missions/level-scaling.ts)):

| Target | Formula (level L) |
|--------|-------------------|
| Objectives (gold/count) | × `1.012^(L-1)` |
| Gold rewards (catalog + claim) | × `1.035^(L-1)` × `missionGoldReward` × `GAME_BALANCE` |
| Power-up rewards | `count + floor(L / 20)` |
| Renown | unchanged |

Example multipliers:

| Level | Objective mult | Gold reward mult |
|-------|----------------|------------------|
| 1 | ×1 | ×1 |
| 25 | ×1.31 | ×2.28 |
| 50 | ×1.81 | ×5.58 |
| 100 | ×3.27 | ×31.0 |

Shown in the header as `Lv. {level}`; used by mission slots, claim dialog, and `claimMissionReward`.

**Catalog loop:** the 200 missions run in a continuous loop (`mission-200` → `mission-001`). Claimed missions can reappear in active slots; `renownPercent` is preserved across replays. Replay progress uses fresh baselines so lifetime objectives require new progress.

Effective cycle time: `(baseTime × hasteRune) / cumulativeGodSpeed`.

## Per-factory reference (balance-adjusted, `factoryDifficulty = 1`)

From [`getFactoryReferenceMetrics(1)`](../src/game/progression-estimates.ts):

| Factory | Cycle (s) | Value / unit / cycle | Unlock gold | Manager | Upgrade | Gold/s (1 unit) |
|---------|-----------|----------------------|-------------|---------|---------|-----------------|
| Grain | 1 | 57 | — | 4 301 | 19 550 | 57.0 |
| Wine | 3 | 456 | 15 000 | 33 660 | 153 000 | 152.0 |
| Iron | 5 | 3 648 | 150 000 | 280 500 | 1 275 000 | 729.6 |
| Crossbow | 10 | 29 184 | 1 000 000 | 2 244 000 | 10 200 000 | 2 918.4 |
| Longship | 20 | 233 472 | 12 500 000 | 22 440 000 | 102 000 000 | 11 673.6 |
| Reliquary | 40 | 1 867 776 | 125 000 000 | 230 010 000 | 1 045 500 000 | 46 694.4 |

### Early ease (`factoryDifficulty = 1.55`)

| Factory | Value / cycle | Unlock | Manager | Gold/s (1 unit) |
|---------|---------------|--------|---------|-----------------|
| Grain | 88.4 | — | 2 775 | 88.4 |
| Wine | 706.8 | 9 677 | 21 716 | 235.6 |

## God invoke thresholds

From [`getGodInvokeThresholds()`](../src/game/progression-estimates.ts) — `godGoldRequired` (0.60) ÷ `GAME_BALANCE` (1.5):

| God | **Effective threshold** |
|-----|-------------------------|
| Huangdi | **4×10¹¹** |
| Dagda | **4×10¹⁷** |
| Shango | **4×10²³** |
| Indra | **4×10²⁹** |
| Tangaroa | **4×10³⁵** |
| Inti | **4×10⁴¹** |

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
| Grain manager | ~1 min |
| Unlock wine | ~1–2 min |
| **1st god (Huangdi)** | **~45–90 min** |
| 2nd → 6th gods | Each run longer (higher threshold, stacked bonuses help rebuild) |
| **All six gods** | **~2–4 days** focused active play |

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
