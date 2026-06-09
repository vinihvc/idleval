import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
import { LOCAL_STORAGE_KEYS } from "@/config/local-storage-keys";
import { store } from "@/providers/store";
import {
  canPurchaseAnyManager,
  canPurchaseAnyUpgrade,
  useCanPurchaseAnyManager,
  useCanPurchaseAnyUpgrade,
} from "@/store/atoms/factories.selectors";
import { canInvokeGod, useCanInvokeGod } from "@/store/atoms/gods";
import {
  getHasActivatablePowerUp,
  getHasPendingDailyReward,
  useDailyReward,
  useHasActivatablePowerUp,
} from "@/store/atoms/inventory";
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
  LOCAL_STORAGE_KEYS.notifications,
  initialNotificationsState()
);

const getNotificationActive = (key: NotificationKey): boolean => {
  switch (key) {
    case "upgrades":
      return canPurchaseAnyUpgrade();
    case "managers":
      return canPurchaseAnyManager();
    case "gods":
      return canInvokeGod();
    case "inventory":
      return getHasActivatablePowerUp();
    case "daily":
      return getHasPendingDailyReward();
    default:
      return false;
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

export const useNotifications = (): Record<NotificationKey, boolean> => {
  const upgradesActive = useCanPurchaseAnyUpgrade();
  const managersActive = useCanPurchaseAnyManager();
  const godsActive = useCanInvokeGod();
  const inventoryActive = useHasActivatablePowerUp();
  const { isPending: dailyActive } = useDailyReward();
  const { dismissed } = useNotificationsState();

  const activeByKey = useMemo(
    () =>
      ({
        upgrades: upgradesActive,
        managers: managersActive,
        gods: godsActive,
        inventory: inventoryActive,
        daily: dailyActive,
      }) satisfies Record<NotificationKey, boolean>,
    [upgradesActive, managersActive, godsActive, inventoryActive, dailyActive]
  );

  useEffect(() => {
    for (const key of NOTIFICATION_KEYS) {
      if (!activeByKey[key]) {
        clearDismissed(key);
      }
    }
  }, [activeByKey]);

  return useMemo(
    () =>
      ({
        upgrades: activeByKey.upgrades && !dismissed.upgrades,
        managers: activeByKey.managers && !dismissed.managers,
        gods: activeByKey.gods && !dismissed.gods,
        inventory: activeByKey.inventory && !dismissed.inventory,
        daily: activeByKey.daily && !dismissed.daily,
      }) satisfies Record<NotificationKey, boolean>,
    [activeByKey, dismissed]
  );
};

export const useNotificationDialogHandler = (key: NotificationKey) =>
  useCallback(
    (open: boolean) => {
      if (open) {
        dismissNotification(key);
      }
    },
    [key]
  );
