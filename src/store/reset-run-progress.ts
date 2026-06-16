import { createInitialMissionCounters } from "@/game/types";
import { store } from "@/providers/store";
import { factoriesAtom, initialData } from "@/store/atoms/factories.atom";
import { missionsAtom } from "@/store/atoms/missions.atom";
import {
  createInitialProductionTicks,
  productionTicksAtom,
} from "@/store/atoms/production-ticks.atom";
import { purchaseModeAtom } from "@/store/atoms/purchase-mode";
import { walletAtom } from "@/store/atoms/wallet";
import { offlineCycleProgressAtom } from "@/store/offline-earning";
import { D, serializeDecimal } from "@/utils/decimal";

export const resetRunProgress = () => {
  store.set(walletAtom, { gold: serializeDecimal(D(0)) });
  store.set(factoriesAtom, structuredClone(initialData));
  store.set(purchaseModeAtom, { amountToBuy: 1 });
  store.set(productionTicksAtom, createInitialProductionTicks());
  store.set(offlineCycleProgressAtom, {});
  store.set(missionsAtom, (previous) => {
    const runCounters = createInitialMissionCounters();

    return {
      ...previous,
      counters: {
        ...previous.counters,
        runGoldEarned: runCounters.runGoldEarned,
        runGoldSpent: runCounters.runGoldSpent,
      },
    };
  });
};
