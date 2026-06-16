import React from "react";
import { syncMissionProgress } from "@/store/atoms/missions";
import { refreshDailyStreakState } from "@/store/atoms/daily-reward.actions";
import { useNotificationSync } from "./use-notification-sync";
import { useOfflineEarning } from "./use-offline-earning";
import { useProductionScheduler } from "./use-production-scheduler";

const LazyOfflineEarningDialog = React.lazy(
  () => import("@/components/dialog/offline-earning/offline-earning")
);

export const OfflineEarning = ({ children }: React.PropsWithChildren) => {
  React.useEffect(() => {
    refreshDailyStreakState();
    syncMissionProgress();
  }, []);

  useNotificationSync();
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
