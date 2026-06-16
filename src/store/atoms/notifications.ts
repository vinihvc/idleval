import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { LOCAL_STORAGE } from "@/config/local-storage";
import { store } from "@/providers/store";
import {
  canPurchaseAnyManager,
  canPurchaseAnyUpgrade,
  useCanPurchaseAnyManager,
  useCanPurchaseAnyUpgrade,
} from "@/store/atoms/factories";
import { canInvokeGod, useCanInvokeGod } from "@/store/atoms/gods";
import {
  getHasActivatablePowerUp,
  useHasActivatablePowerUp,
} from "@/store/atoms/inventory";
import {
  getHasPendingDailyReward,
  useDailyReward,
} from "@/store/atoms/daily-reward.atom";
import { persistedAtom } from "@/store/storage";

export type NotificationKey =
  | "upgrades"
  | "managers"
  | "gods"
  | "inventory"
  | "daily";

export const NOTIFICATION_KEYS = [
  "upgrades",
  "managers",
  "gods",
  "inventory",
  "daily",
] as const satisfies readonly NotificationKey[];

export interface NotificationsState {
  dismissed: Partial<Record<NotificationKey, true>>;
}

export const initialNotificationsState = (): NotificationsState => ({
  dismissed: {},
});

export const notificationsAtom = persistedAtom<NotificationsState>(
  LOCAL_STORAGE.notifications,
  initialNotificationsState()
);

export type NotificationActiveMap = Record<NotificationKey, boolean>;

export const buildNotificationActiveMap = (
  input: NotificationActiveMap
): NotificationActiveMap => ({
  upgrades: input.upgrades,
  managers: input.managers,
  gods: input.gods,
  inventory: input.inventory,
  daily: input.daily,
});

const applyNotificationDismissals = (
  activeByKey: NotificationActiveMap,
  dismissed: NotificationsState["dismissed"]
): NotificationActiveMap => ({
  upgrades: activeByKey.upgrades && !dismissed.upgrades,
  managers: activeByKey.managers && !dismissed.managers,
  gods: activeByKey.gods && !dismissed.gods,
  inventory: activeByKey.inventory && !dismissed.inventory,
  daily: activeByKey.daily && !dismissed.daily,
});

export const getActiveNotificationsByKey = (): NotificationActiveMap =>
  buildNotificationActiveMap({
    upgrades: canPurchaseAnyUpgrade(),
    managers: canPurchaseAnyManager(),
    gods: canInvokeGod(),
    inventory: getHasActivatablePowerUp(),
    daily: getHasPendingDailyReward(),
  });

const getNotificationActive = (key: NotificationKey): boolean =>
  getActiveNotificationsByKey()[key];

export const syncNotificationDismissals = (
  activeByKey: Record<NotificationKey, boolean>
) => {
  for (const key of NOTIFICATION_KEYS) {
    if (!activeByKey[key]) {
      clearDismissed(key);
    }
  }
};

export const dismissNotification = (key: NotificationKey) => {
  store.set(notificationsAtom, (previous) => ({
    dismissed: { ...previous.dismissed, [key]: true },
  }));
};

export const clearDismissed = (key: NotificationKey) => {
  store.set(notificationsAtom, (previous) => {
    if (!previous.dismissed[key]) {
      return previous;
    }

    const { [key]: _removed, ...rest } = previous.dismissed;

    return { dismissed: rest };
  });
};

export const isNotificationVisible = (key: NotificationKey): boolean => {
  if (!getNotificationActive(key)) {
    return false;
  }

  return !store.get(notificationsAtom).dismissed[key];
};

export const useNotificationsState = () => useAtomValue(notificationsAtom);

export const useNotificationActiveMap = (): NotificationActiveMap => {
  const upgradesActive = useCanPurchaseAnyUpgrade();
  const managersActive = useCanPurchaseAnyManager();
  const godsActive = useCanInvokeGod();
  const inventoryActive = useHasActivatablePowerUp();
  const { isPending: dailyActive } = useDailyReward();

  return useMemo(
    () =>
      buildNotificationActiveMap({
        upgrades: upgradesActive,
        managers: managersActive,
        gods: godsActive,
        inventory: inventoryActive,
        daily: dailyActive,
      }),
    [upgradesActive, managersActive, godsActive, inventoryActive, dailyActive]
  );
};

export const useNotifications = (): NotificationActiveMap => {
  const activeByKey = useNotificationActiveMap();
  const { dismissed } = useNotificationsState();

  return useMemo(
    () => applyNotificationDismissals(activeByKey, dismissed),
    [activeByKey, dismissed]
  );
};
