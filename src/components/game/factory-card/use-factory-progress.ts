import React from "react";
import { getCycleProgress } from "@/game/factory-cycle";
import type { FactoryTickState } from "@/store/atoms/production-ticks.atom";

export interface FactoryProgressView {
  durationSec: number;
  progress: number;
  remainingSec: number;
}

const getReducedMotion = (): boolean => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getIdleProgress = (idleDurationSec: number): FactoryProgressView => ({
  durationSec: idleDurationSec,
  progress: 0,
  remainingSec: idleDurationSec,
});

/**
 * Derives smooth factory progress from wall-clock cycle anchors.
 */
export const useFactoryProgress = (
  tick: FactoryTickState,
  idleDurationSec: number
): FactoryProgressView => {
  const { cycleDurationSec, cycleEndsAt, cycleKey, isRunning } = tick;

  const resolveProgress = React.useCallback((): FactoryProgressView => {
    if (!isRunning) {
      return getIdleProgress(idleDurationSec);
    }

    return getCycleProgress({
      cycleDurationSec,
      cycleEndsAt,
      cycleKey,
      isRunning,
      seconds: 0,
    });
  }, [cycleDurationSec, cycleEndsAt, cycleKey, idleDurationSec, isRunning]);

  const [view, setView] = React.useState<FactoryProgressView>(resolveProgress);

  React.useEffect(() => {
    if (!isRunning) {
      setView(getIdleProgress(idleDurationSec));
      return;
    }

    const reducedMotion = getReducedMotion();

    if (reducedMotion) {
      setView(resolveProgress());
      const intervalId = window.setInterval(() => {
        setView(resolveProgress());
      }, 1000);

      return () => window.clearInterval(intervalId);
    }

    let frameId = 0;

    const update = () => {
      setView(resolveProgress());
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(frameId);
  }, [idleDurationSec, isRunning, resolveProgress]);

  return view;
};
