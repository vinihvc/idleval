import { useEffect, useMemo } from "react";
import {
  useCanPurchaseAnyManager,
  useCanPurchaseAnyUpgrade,
} from "@/store/atoms/factories.selectors";
import { useCanInvokeGod } from "@/store/atoms/gods";
import {
  useDailyReward,
  useHasActivatablePowerUp,
} from "@/store/atoms/inventory";
import { syncNotificationDismissals } from "@/store/atoms/notifications";

export const useNotificationSync = () => {
  const upgradesActive = useCanPurchaseAnyUpgrade();
  const managersActive = useCanPurchaseAnyManager();
  const godsActive = useCanInvokeGod();
  const inventoryActive = useHasActivatablePowerUp();
  const { isPending: dailyActive } = useDailyReward();

  const activeByKey = useMemo(
    () => ({
      upgrades: upgradesActive,
      managers: managersActive,
      gods: godsActive,
      inventory: inventoryActive,
      daily: dailyActive,
    }),
    [upgradesActive, managersActive, godsActive, inventoryActive, dailyActive]
  );

  useEffect(() => {
    syncNotificationDismissals(activeByKey);
  }, [activeByKey]);
};
