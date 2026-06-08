import { useSetAtom } from "jotai";
import React, { Suspense } from "react";
import { LazyOfflineEarningsDialog } from "@/components/dialog/lazy";
import { useSessionSync } from "@/hooks/use-session-sync";
import {
  applyOfflineEarnings,
  offlineSummaryAtom,
  useOfflineSummary,
} from "@/store/offline";

let hasAppliedOffline = false;

export const OfflineBootstrap = ({ children }: React.PropsWithChildren) => {
  const summary = useOfflineBootstrap();

  return (
    <>
      {children}
      {summary ? (
        <Suspense fallback={null}>
          <LazyOfflineEarningsDialog summary={summary} />
        </Suspense>
      ) : null}
    </>
  );
};

const useOfflineBootstrap = () => {
  const summary = useOfflineSummary();
  const setSummary = useSetAtom(offlineSummaryAtom);

  useSessionSync(() => {
    const offlineSummary = applyOfflineEarnings();

    if (offlineSummary) {
      setSummary(offlineSummary);
    }
  });

  React.useEffect(() => {
    if (hasAppliedOffline) {
      return;
    }

    hasAppliedOffline = true;

    const offlineSummary = applyOfflineEarnings();

    if (offlineSummary) {
      setSummary(offlineSummary);
    }
  }, [setSummary]);

  return summary;
};
