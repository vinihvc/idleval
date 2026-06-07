import { atom, useAtomValue } from "jotai";
import {
  computeOfflineEarnings,
  meetsMinimumOfflineDuration,
  type OfflineFactoryResult,
} from "@/game/offline-earnings";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories";
import { getGodsProductionMultiplier } from "@/store/atoms/gods";
import {
  getLastSeenAt,
  offlineCycleProgressAtom,
  touchLastSeen,
} from "@/store/atoms/session";
import { bulkIncreaseGold } from "@/store/atoms/wallet";
import type { GameValue } from "@/utils/decimal";

export interface OfflineSummary {
  elapsedMs: number;
  results: OfflineFactoryResult[];
  totalGold: GameValue;
}

export const offlineSummaryAtom = atom<OfflineSummary | null>(null);

export const useOfflineSummary = () => useAtomValue(offlineSummaryAtom);

const clearManualProducing = () => {
  store.set(factoriesAtom, (prev) => {
    let changed = false;
    const next = { ...prev };

    for (const factory of Object.keys(next) as (keyof typeof next)[]) {
      if (next[factory].isProducing) {
        next[factory] = { ...next[factory], isProducing: false };
        changed = true;
      }
    }

    return changed ? next : prev;
  });
};

const setOfflineCycleProgress = (results: OfflineFactoryResult[]) => {
  const progress = Object.fromEntries(
    results.map((result) => [result.factory, result.secondsRemaining])
  );

  store.set(offlineCycleProgressAtom, progress);
};

export const applyOfflineEarnings = (
  now = Date.now()
): OfflineSummary | null => {
  const lastSeenAt = getLastSeenAt();
  const factories = store.get(factoriesAtom);
  const computed = computeOfflineEarnings(
    now,
    lastSeenAt,
    factories,
    getGodsProductionMultiplier()
  );

  if (!meetsMinimumOfflineDuration(computed.elapsedMs)) {
    touchLastSeen(now);
    return null;
  }

  clearManualProducing();

  const entries = computed.results
    .filter((result) => result.goldEarned.gt(0))
    .map((result) => ({
      factory: result.factory,
      gold: result.goldEarned,
    }));

  bulkIncreaseGold(entries);

  if (computed.results.length > 0) {
    setOfflineCycleProgress(computed.results);
  }

  touchLastSeen(now);

  if (computed.totalGold.lte(0)) {
    return null;
  }

  return {
    elapsedMs: computed.elapsedMs,
    totalGold: computed.totalGold,
    results: computed.results.filter((result) => result.cycles > 0),
  };
};
