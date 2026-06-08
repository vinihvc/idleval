import { store } from "@/providers/store";
import { godsAtom } from "@/store/atoms/gods";
import { sessionAtom } from "@/store/atoms/session";
import { initialStatistics, statisticsAtom } from "@/store/atoms/statistics";
import {
  offlineCycleProgressAtom,
  offlineSummaryAtom,
} from "@/store/offline";
import { resetRunProgress } from "@/store/reset-run-progress";
import { D, serializeDecimal } from "@/utils/decimal";

export { resetRunProgress } from "@/store/reset-run-progress";

export const resetGame = () => {
  resetRunProgress();
  store.set(statisticsAtom, {
    goldEarned: serializeDecimal(D(0)),
    goldSpent: serializeDecimal(D(0)),
    factories: initialStatistics,
  });
  store.set(godsAtom, { invoked: [] });
  store.set(sessionAtom, { lastSeenAt: Date.now() });
  store.set(offlineCycleProgressAtom, {});
  store.set(offlineSummaryAtom, null);
};
