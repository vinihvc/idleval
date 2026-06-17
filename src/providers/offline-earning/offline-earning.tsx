import React from "react";
import { refreshDailyStreakState } from "@/store/atoms/daily-reward.actions";
import { syncMissionProgress } from "@/store/atoms/missions";
import {
  syncNotificationDismissals,
  useNotificationActiveMap,
} from "@/store/atoms/notifications";
import { useOfflineEarning } from "./use-offline-earning";
import { useProductionScheduler } from "./use-production-scheduler";

const LazyOfflineEarningDialog = React.lazy(() =>
  import("@/components/dialog/offline-earning/offline-earning").then(
    (module) => ({
      default: module.OfflineEarningDialog,
    })
  )
);

export const OfflineEarning = ({ children }: React.PropsWithChildren) => {
  React.useEffect(() => {
    refreshDailyStreakState();
    syncMissionProgress();
  }, []);

  const activeByKey = useNotificationActiveMap();

  React.useEffect(() => {
    syncNotificationDismissals(activeByKey);
  }, [activeByKey]);

  const summary = useOfflineEarning();
  useProductionScheduler();

  return (
    <>
      {children}
      {summary && (
        <React.Suspense fallback={null}>
          <LazyOfflineEarningDialog summary={summary} />
        </React.Suspense>
      )}
    </>
  );
};
