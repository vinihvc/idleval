import {
  FACTORIES,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import { D, type GameValue } from "@/utils/decimal";
import { getFactoryEarnPerCycle } from "./factories";
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

export const meetsMinimumOfflineDuration = (elapsedMs: number): boolean =>
  elapsedMs >= MIN_OFFLINE_MS;

export interface OfflineEarningsComputed {
  /** Total elapsed time considered for offline production. */
  elapsedMs: number;
  /** Per-factory production results for automated and unlocked factories. */
  results: OfflineFactoryResult[];
  /** Combined gold earned by all factories during the offline window. */
  totalGold: GameValue;
}

/**
 * Calculates how much one automated factory earns per completed offline cycle.
 */
const getEarnPerCycle = (
  factory: FactoryType,
  state: FactoryPersistedState,
  godsProductionMultiplier: GameValue
): GameValue => {
  const config = FACTORIES[factory];

  return getFactoryEarnPerCycle({
    amount: state.amount,
    godsProductionMultiplier,
    isUpgraded: state.isUpgraded,
    productionValue: config.productionValue,
  });
};

/**
 * Simulates automated factory production for the time elapsed since the last
 * session and returns the per-factory and total offline rewards.
 */
export const computeOfflineEarnings = (
  now: number,
  lastSeenAt: number | null,
  factories: FactoriesPersistedState,
  godsProductionMultiplier: GameValue
): OfflineEarningsComputed => {
  const empty: OfflineEarningsComputed = {
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

  const elapsedSec = elapsedMs / 1000;
  const results: OfflineFactoryResult[] = [];
  let totalGold = D(0);

  for (const factory of FACTORY_TYPES) {
    const state = factories[factory];

    if (!(state?.isAutomated && state.isUnlocked)) {
      continue;
    }

    const { productionTime } = FACTORIES[factory];
    const cycles = Math.floor(elapsedSec / productionTime);
    const earnPerCycle = getEarnPerCycle(
      factory,
      state,
      godsProductionMultiplier
    );
    const goldEarned = earnPerCycle.times(cycles);
    const remainderSec = elapsedSec % productionTime;
    const secondsRemaining =
      remainderSec === 0 ? productionTime : productionTime - remainderSec;

    results.push({
      factory,
      cycles,
      goldEarned,
      secondsRemaining,
    });

    totalGold = totalGold.plus(goldEarned);
  }

  return { results, totalGold, elapsedMs };
};
