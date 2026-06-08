import React from "react";

import { useOfflineBootstrap } from "@/hooks/use-offline-bootstrap";

const LazyOfflineEarningsDialog = React.lazy(
  () => import("@/components/dialog/offline-earnings/offline-earnings")
);

export const OfflineBootstrap = ({ children }: React.PropsWithChildren) => {
  const summary = useOfflineBootstrap();

  return (
    <>
      {children}
      {summary && (
        <React.Suspense fallback={null}>
          <LazyOfflineEarningsDialog summary={summary} />
        </React.Suspense>
      )}
    </>
  );
};
