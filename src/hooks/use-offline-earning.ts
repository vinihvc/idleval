import { useVisibilityChange } from "@uidotdev/usehooks";
import { useSetAtom } from "jotai";
import React from "react";
import { touchLastSeen, touchLastSeenIfVisible } from "@/store/atoms/session";
import {
  applyOfflineEarning,
  type OfflineSummary,
  offlineSummaryAtom,
  useOfflineSummary,
} from "@/store/offline-earning";

const HEARTBEAT_MS = 60_000;

export const shouldRunOnTabVisible = (
  prevVisible: boolean | null,
  nextVisible: boolean
): boolean => prevVisible === false && nextVisible === true;

export const shouldHeartbeatTouchLastSeen = (isVisible: boolean): boolean =>
  isVisible;

const applyAndShowSummary = (
  setSummary: (summary: OfflineSummary | null) => void
) => {
  const summary = applyOfflineEarning();

  if (summary) {
    setSummary(summary);
  }
};

export const useOfflineEarning = (): OfflineSummary | null => {
  const summary = useOfflineSummary();
  const setSummary = useSetAtom(offlineSummaryAtom);
  const isVisible = useVisibilityChange();
  const prevVisibleRef = React.useRef<boolean | null>(null);
  const hasAppliedOnMount = React.useRef(false);

  React.useEffect(() => {
    if (hasAppliedOnMount.current) {
      return;
    }

    hasAppliedOnMount.current = true;
    applyAndShowSummary(setSummary);
  }, [setSummary]);

  React.useEffect(() => {
    if (prevVisibleRef.current === null) {
      prevVisibleRef.current = isVisible;
      return;
    }

    if (shouldRunOnTabVisible(prevVisibleRef.current, isVisible)) {
      applyAndShowSummary(setSummary);
    }

    prevVisibleRef.current = isVisible;
  }, [isVisible, setSummary]);

  React.useEffect(() => {
    if (!isVisible) {
      touchLastSeen();
    }
  }, [isVisible]);

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      touchLastSeen();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const heartbeat = window.setInterval(() => {
      touchLastSeenIfVisible();
    }, HEARTBEAT_MS);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.clearInterval(heartbeat);
    };
  }, []);

  return summary;
};
