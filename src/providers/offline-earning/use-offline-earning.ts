import { useVisibilityChange } from "@uidotdev/usehooks";
import { useSetAtom } from "jotai";
import React from "react";
import {
  getLastSeenAt,
  touchLastSeen,
  touchLastSeenIfVisible,
} from "@/store/atoms/session";
import {
  applyOfflineEarning,
  type OfflineSummary,
  offlineSummaryAtom,
  useOfflineSummary,
} from "@/store/offline-earning";

const HEARTBEAT_MS = 60_000;
const RESUME_GAP_MS = HEARTBEAT_MS * 1.5;

type VisibleResumeAction = "apply" | "ignore" | "touch";

export const shouldRunOnTabVisible = (
  prevVisible: boolean | null,
  nextVisible: boolean
): boolean => prevVisible === false && nextVisible === true;

export const shouldHeartbeatTouchLastSeen = (isVisible: boolean): boolean =>
  isVisible;

export const getVisibleResumeAction = ({
  isVisible,
  lastSeenAt,
  now,
}: {
  isVisible: boolean;
  lastSeenAt: number | null;
  now: number;
}): VisibleResumeAction => {
  if (!isVisible) {
    return "ignore";
  }

  if (lastSeenAt === null || lastSeenAt > now) {
    return "touch";
  }

  return now - lastSeenAt > RESUME_GAP_MS ? "apply" : "touch";
};

const applyAndShowSummary = (
  setSummary: (summary: OfflineSummary | null) => void,
  now = Date.now()
) => {
  const summary = applyOfflineEarning(now);

  if (summary) {
    setSummary(summary);
  }
};

const handleVisibleResume = (
  setSummary: (summary: OfflineSummary | null) => void,
  now = Date.now()
) => {
  const action = getVisibleResumeAction({
    isVisible: document.visibilityState === "visible",
    lastSeenAt: getLastSeenAt(),
    now,
  });

  if (action === "apply") {
    applyAndShowSummary(setSummary, now);
    return;
  }

  if (action === "touch") {
    touchLastSeenIfVisible(now);
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
    const handleBrowserResume = () => {
      handleVisibleResume(setSummary);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("focus", handleBrowserResume);
    window.addEventListener("pageshow", handleBrowserResume);

    const heartbeat = window.setInterval(() => {
      handleVisibleResume(setSummary);
    }, HEARTBEAT_MS);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("focus", handleBrowserResume);
      window.removeEventListener("pageshow", handleBrowserResume);
      window.clearInterval(heartbeat);
    };
  }, [setSummary]);

  return summary;
};
