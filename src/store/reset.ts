import { store } from "@/providers/store";
import { factoriesAtom, initialData } from "@/store/atoms/factories.atom";
import { godsAtom } from "@/store/atoms/gods";
import { purchaseModeAtom } from "@/store/atoms/purchase-mode";
import { offlineCycleProgressAtom, sessionAtom } from "@/store/atoms/session";
import { initialStatistics, statisticsAtom } from "@/store/atoms/statistics";
import { walletAtom } from "@/store/atoms/wallet";
import { offlineSummaryAtom } from "@/store/offline";
import { D, serializeDecimal } from "@/utils/decimal";

export const resetRunProgress = () => {
  store.set(walletAtom, { gold: serializeDecimal(D(0)) });
  store.set(factoriesAtom, initialData);
  store.set(purchaseModeAtom, { amountToBuy: 1 });
};

export const resetGame = () => {
  resetRunProgress();
  store.set(statisticsAtom, {
    goldEarned: serializeDecimal(D(0)),
    goldSpent: serializeDecimal(D(0)),
    factories: initialStatistics,
  });
  store.set(godsAtom, { count: 0 });
  store.set(sessionAtom, { lastSeenAt: Date.now() });
  store.set(offlineCycleProgressAtom, {});
  store.set(offlineSummaryAtom, null);
};
