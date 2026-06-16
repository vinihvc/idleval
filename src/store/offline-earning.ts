import { atom, useAtomValue } from "jotai";
import {
  FACTORY_DATA,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import { getFactoryEarnPerCycle } from "@/game/factories";
import {
  clearManualProductionFields,
  reconcileManualCycle,
} from "@/game/manual-production";
import {
  computeOfflineEarning,
  meetsMinimumOfflineDuration,
  type OfflineEarningComputed,
  type OfflineFactoryResult,
} from "@/game/offline-earning";
import { store } from "@/providers/store";
import { completeProductionCycle } from "@/store/atoms/factories.actions";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getFactory } from "@/store/atoms/factories.selectors";
import { getGodsProductionMultiplier } from "@/store/atoms/gods";
import {
  getActivePowerUp,
  getPowerUpIncomeMultiplierForEarn,
} from "@/store/atoms/inventory";
import { getMissionRenownProductionMultiplier } from "@/store/atoms/missions.selectors";
import { refreshExpiredPowerUps } from "@/store/atoms/power-ups.actions";
import { getLastSeenAt, touchLastSeen } from "@/store/atoms/session";
import { bulkIncreaseGold } from "@/store/atoms/wallet";
import { D, type GameValue } from "@/utils/decimal";

export type OfflineSummary = Pick<
  OfflineEarningComputed,
  "elapsedMs" | "totalGold"
> & {
  results: OfflineFactoryResult[];
};

export const offlineSummaryAtom = atom<OfflineSummary | null>(null);

export const offlineCycleProgressAtom = atom<
  Partial<Record<FactoryType, number>>
>({});

export const useOfflineSummary = () => useAtomValue(offlineSummaryAtom);

export const useOfflineCycleProgress = () =>
  useAtomValue(offlineCycleProgressAtom);

export const clearOfflineSummary = () => {
  store.set(offlineSummaryAtom, null);
};

const getManualCycleGoldEarned = (factory: FactoryType): GameValue => {
  const { amount, isUpgraded, productionValue } = getFactory(factory);

  return getFactoryEarnPerCycle({
    amount,
    godsProductionMultiplier: getGodsProductionMultiplier(),
    isUpgraded,
    productionValue,
  })
    .times(getPowerUpIncomeMultiplierForEarn())
    .times(getMissionRenownProductionMultiplier());
};

const mergeOfflineCycleProgress = (results: OfflineFactoryResult[]) => {
  if (results.length === 0) {
    return;
  }

  const progress = Object.fromEntries(
    results.map((result) => [result.factory, result.secondsRemaining])
  );

  store.set(offlineCycleProgressAtom, (previous) => ({
    ...previous,
    ...progress,
  }));
};

/**
 * Reconciles in-flight manual production cycles against wall-clock time.
 * Completes at most one cycle per factory and syncs partial progress.
 */
export const reconcileManualProduction = (
  now = Date.now()
): OfflineFactoryResult[] => {
  const completed: OfflineFactoryResult[] = [];
  const inProgress: Partial<Record<FactoryType, number>> = {};

  for (const factory of FACTORY_TYPES) {
    const state = store.get(factoriesAtom)[factory];

    if (
      state.isProducing &&
      !state.isAutomated &&
      (state.productionStartedAt == null || state.productionDurationSec == null)
    ) {
      store.set(factoriesAtom, (previous) => ({
        ...previous,
        [factory]: clearManualProductionFields(previous[factory]),
      }));
      continue;
    }

    const reconcileResult = reconcileManualCycle(state, now);

    if (reconcileResult.kind === "complete") {
      const goldEarned = getManualCycleGoldEarned(factory);
      const durationSec =
        state.productionDurationSec ?? FACTORY_DATA[factory].productionTime;

      completeProductionCycle(factory);

      completed.push({
        factory,
        cycles: 1,
        goldEarned,
        secondsRemaining: durationSec,
      });
      continue;
    }

    if (reconcileResult.kind === "in_progress") {
      inProgress[factory] = reconcileResult.secondsRemaining;
    }
  }

  if (Object.keys(inProgress).length > 0) {
    store.set(offlineCycleProgressAtom, (previous) => ({
      ...previous,
      ...inProgress,
    }));
  }

  return completed;
};

export const applyOfflineEarning = (
  now = Date.now()
): OfflineSummary | null => {
  const manualResults = reconcileManualProduction(now);
  const manualGold = manualResults.reduce(
    (sum, result) => sum.plus(result.goldEarned),
    D(0)
  );

  const lastSeenAt = getLastSeenAt();
  const factories = store.get(factoriesAtom);
  const computed = computeOfflineEarning(
    now,
    lastSeenAt,
    factories,
    getGodsProductionMultiplier(),
    getActivePowerUp()
  );

  if (!meetsMinimumOfflineDuration(computed.elapsedMs)) {
    touchLastSeen(now);
    return null;
  }

  const entries = computed.results
    .filter((result) => result.goldEarned.gt(0))
    .map((result) => ({
      factory: result.factory,
      gold: result.goldEarned,
    }));

  bulkIncreaseGold(entries);
  mergeOfflineCycleProgress(computed.results);

  touchLastSeen(now);
  refreshExpiredPowerUps(now);

  const totalGold = computed.totalGold.plus(manualGold);
  const summaryResults = [
    ...manualResults.filter((result) => result.cycles > 0),
    ...computed.results.filter((result) => result.cycles > 0),
  ];

  if (totalGold.lte(0)) {
    return null;
  }

  return {
    elapsedMs: computed.elapsedMs,
    totalGold,
    results: summaryResults,
  };
};
