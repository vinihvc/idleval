import { createInitialMissionsState } from "@/game/types";
import { store } from "@/providers/store";
import {
  dailyRewardAtom,
  initialDailyRewardState,
} from "@/store/atoms/daily-reward.atom";
import { dialogsAtom } from "@/store/atoms/dialogs";
import { godsAtom } from "@/store/atoms/gods";
import { initialInventoryState, inventoryAtom } from "@/store/atoms/inventory";
import { missionsAtom } from "@/store/atoms/missions.atom";
import {
  initialNotificationsState,
  notificationsAtom,
} from "@/store/atoms/notifications";
import { sessionAtom } from "@/store/atoms/session";
import { initialStatistics, statisticsAtom } from "@/store/atoms/statistics";
import {
  offlineCycleProgressAtom,
  offlineSummaryAtom,
} from "@/store/offline-earning";
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
  store.set(inventoryAtom, initialInventoryState);
  store.set(dailyRewardAtom, initialDailyRewardState);
  store.set(missionsAtom, createInitialMissionsState());
  store.set(notificationsAtom, initialNotificationsState());
  store.set(sessionAtom, { lastSeenAt: Date.now() });
  store.set(offlineCycleProgressAtom, {});
  store.set(offlineSummaryAtom, null);
  store.set(dialogsAtom, null);
};
