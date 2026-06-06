import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import { OfflineEarningsDialog } from "@/components/dialog/offline-earnings";
import { useSessionSync } from "@/hooks/use-session-sync";
import { factoriesAtom } from "@/store/atoms/factories";
import { sessionAtom } from "@/store/atoms/session";
import { walletAtom } from "@/store/atoms/wallet";
import { applyOfflineEarnings, offlineSummaryAtom } from "@/store/offline";

let hasAppliedOffline = false;

export const OfflineBootstrap = ({ children }: React.PropsWithChildren) => {
  const summary = useOfflineBootstrap();

  return (
    <>
      {children}
      {summary ? <OfflineEarningsDialog summary={summary} /> : null}
    </>
  );
};

const useOfflineBootstrap = () => {
  const summary = useAtomValue(offlineSummaryAtom);
  const setSummary = useSetAtom(offlineSummaryAtom);

  useAtomValue(sessionAtom);
  useAtomValue(factoriesAtom);
  useAtomValue(walletAtom);

  useSessionSync();

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
