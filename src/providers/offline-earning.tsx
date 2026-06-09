import React from "react";

import { useOfflineEarning } from "@/hooks/use-offline-earning";
import { usePowerUpBootstrap } from "@/hooks/use-power-up-bootstrap";
import { useProductionScheduler } from "@/hooks/use-production-scheduler";

const LazyOfflineEarningDialog = React.lazy(
  () => import("@/components/dialog/offline-earning/offline-earning")
);

export const OfflineEarning = ({ children }: React.PropsWithChildren) => {
  usePowerUpBootstrap();
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
