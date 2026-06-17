import {
  FACTORY_DATA,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import { getScaledFactoryConfig } from "@/game/balance";
import { getGameDifficulty } from "@/game/difficulty";
import { D, type GameValue } from "@/utils/decimal";
import { getFactoryEarnPerCycle } from "./factories";
import {
  type ActivePowerUp,
  getEffectiveProductionTime,
  getOfflineActiveBuffSeconds,
  getPowerUpIncomeMultiplier,
} from "./power-ups";
import type { FactoriesPersistedState, FactoryPersistedState } from "./types";

export interface OfflineFactoryResult {
  /** Number of full production cycles completed while the player was away. */
  cycles: number;
  /** Factory that produced this offline reward. */
  factory: FactoryType;
  /** Gold earned by this factory during the offline window. */
  goldEarned: GameValue;
  /** Seconds left until this factory completes its next production cycle. */
  secondsRemaining: number;
}

/** Minimum time away before offline earnings are applied or shown. */
export const MIN_OFFLINE_MS = 60_000;

/**
 * Whether the elapsed offline time meets the minimum threshold (60s).
 *
 * @example
 * meetsMinimumOfflineDuration(59_999) // false
 * meetsMinimumOfflineDuration(60_000) // true
 */
export const meetsMinimumOfflineDuration = (elapsedMs: number): boolean =>
  elapsedMs >= MIN_OFFLINE_MS;

export interface OfflineEarningComputed {
  /** Total elapsed time considered for offline production. */
  elapsedMs: number;
  /** Per-factory production results for automated and unlocked factories. */
  results: OfflineFactoryResult[];
  /** Combined gold earned by all factories during the offline window. */
  totalGold: GameValue;
}

export interface OfflineEarningOptions {
  factoryDifficulty?: number;
  godsSpeedMultiplier?: number;
}

/**
 * Calculates how much one automated factory earns per completed offline cycle.
 */
const getEarnPerCycle = (
  factory: FactoryType,
  state: FactoryPersistedState,
  godsProductionMultiplier: GameValue,
  factoryDifficulty: number
): GameValue =>
  getFactoryEarnPerCycle({
    amount: state.amount,
    factoryDifficulty,
    godsProductionMultiplier,
    isUpgraded: state.isUpgraded,
    productionValue: FACTORY_DATA[factory].productionValue,
  });

const computeFactoryOfflineResult = (
  factory: FactoryType,
  state: FactoryPersistedState,
  godsProductionMultiplier: GameValue,
  elapsedSec: number,
  lastSeenAt: number,
  now: number,
  activePowerUp: ActivePowerUp | null,
  factoryDifficulty: number,
  godsSpeedMultiplier: number
): OfflineFactoryResult => {
  const { productionTime: baseProductionTime } =
    getScaledFactoryConfig(factory);
  const normalProductionTime = getEffectiveProductionTime(
    baseProductionTime,
    null,
    godsSpeedMultiplier
  );
  const earnPerCycle = getEarnPerCycle(
    factory,
    state,
    godsProductionMultiplier,
    factoryDifficulty
  );
  const buffSec = getOfflineActiveBuffSeconds(lastSeenAt, now, activePowerUp);

  if (buffSec <= 0) {
    const cycles = Math.floor(elapsedSec / normalProductionTime);
    const goldEarned = earnPerCycle.times(cycles);
    const remainderSec = elapsedSec % normalProductionTime;
    const secondsRemaining =
      remainderSec === 0
        ? normalProductionTime
        : normalProductionTime - remainderSec;

    return {
      factory,
      cycles,
      goldEarned,
      secondsRemaining,
    };
  }

  const normalSec = elapsedSec - buffSec;
  const buffProductionTime = getEffectiveProductionTime(
    baseProductionTime,
    activePowerUp,
    godsSpeedMultiplier,
    lastSeenAt
  );
  const incomeMultiplier = getPowerUpIncomeMultiplier(
    activePowerUp,
    lastSeenAt
  ).toNumber();
  const buffCycles = Math.floor(buffSec / buffProductionTime);
  const normalCycles = Math.floor(normalSec / normalProductionTime);
  const goldEarned = earnPerCycle
    .times(incomeMultiplier)
    .times(buffCycles)
    .plus(earnPerCycle.times(normalCycles));
  const normalRemainder = normalSec % normalProductionTime;
  const secondsRemaining =
    normalRemainder === 0
      ? normalProductionTime
      : normalProductionTime - normalRemainder;

  return {
    factory,
    cycles: buffCycles + normalCycles,
    goldEarned,
    secondsRemaining,
  };
};

/**
 * Simulates automated factory production for the time elapsed since the last
 * session and returns the per-factory and total offline rewards.
 *
 * @example
 * computeOfflineEarning(Date.now(), null, factories, D(1))
 * // { elapsedMs: 0, totalGold: D(0), results: [] }
 *
 * computeOfflineEarning(120_000, 0, { grain: { isAutomated: true, isUnlocked: true, amount: 2, ... } }, D(1))
 * // { elapsedMs: 120000, totalGold: D(...), results: [{ factory: "grain", cycles: N, goldEarned: D(...), secondsRemaining: N }] }
 */
export const computeOfflineEarning = (
  now: number,
  lastSeenAt: number | null,
  factories: FactoriesPersistedState,
  godsProductionMultiplier: GameValue,
  activePowerUp: ActivePowerUp | null = null,
  options?: OfflineEarningOptions
): OfflineEarningComputed => {
  const empty: OfflineEarningComputed = {
    results: [],
    totalGold: D(0),
    elapsedMs: 0,
  };

  if (lastSeenAt === null || lastSeenAt > now) {
    return empty;
  }

  const elapsedMs = now - lastSeenAt;

  if (elapsedMs <= 0) {
    return empty;
  }

  const factoryDifficulty = options?.factoryDifficulty ?? getGameDifficulty();
  const godsSpeedMultiplier = options?.godsSpeedMultiplier ?? 1;
  const elapsedSec = elapsedMs / 1000;
  const results: OfflineFactoryResult[] = [];
  let totalGold = D(0);

  for (const factory of FACTORY_TYPES) {
    const state = factories[factory];

    if (!(state?.isAutomated && state.isUnlocked)) {
      continue;
    }

    const result = computeFactoryOfflineResult(
      factory,
      state,
      godsProductionMultiplier,
      elapsedSec,
      lastSeenAt,
      now,
      activePowerUp,
      factoryDifficulty,
      godsSpeedMultiplier
    );

    results.push(result);

    totalGold = totalGold.plus(result.goldEarned);
  }

  return { results, totalGold, elapsedMs };
};
