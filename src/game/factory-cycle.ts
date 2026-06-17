export interface FactoryCycleTick {
  cycleDurationSec: number;
  cycleEndsAt: number;
  cycleKey: number;
  isRunning: boolean;
  seconds: number;
}

export interface FactoryCycleProgress {
  durationSec: number;
  progress: number;
  remainingSec: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * @example
 * getCycleRemainingSec({ cycleEndsAt: 5000 }, 2000) // 3
 */
export const getCycleRemainingSec = (
  tick: Pick<FactoryCycleTick, "cycleEndsAt">,
  now = Date.now()
): number => Math.max(0, (tick.cycleEndsAt - now) / 1000);

/**
 * @example
 * isCycleComplete({ isRunning: true, cycleEndsAt: 1000 }, 1500) // true
 */
export const isCycleComplete = (
  tick: Pick<FactoryCycleTick, "cycleEndsAt" | "isRunning">,
  now = Date.now()
): boolean => tick.isRunning && now >= tick.cycleEndsAt;

/**
 * @example
 * getCycleProgress(runningTick, now) // { progress: 0.5, remainingSec: 30, durationSec: 60 }
 */
export const getCycleProgress = (
  tick: FactoryCycleTick,
  now = Date.now()
): FactoryCycleProgress => {
  const durationSec = tick.cycleDurationSec;

  if (!tick.isRunning || durationSec <= 0) {
    return {
      durationSec,
      progress: 0,
      remainingSec: durationSec,
    };
  }

  const remainingSec = getCycleRemainingSec(tick, now);
  const progress = clamp(1 - remainingSec / durationSec, 0, 1);

  return {
    durationSec,
    progress,
    remainingSec,
  };
};

export interface StartCycleTickOptions {
  durationSec: number;
  now?: number;
  remainingSec?: number;
}

/**
 * @example
 * startCycleTick(baseTick, { durationSec: 60 }) // new cycle, full duration
 */
export const startCycleTick = (
  current: FactoryCycleTick,
  {
    durationSec,
    now = Date.now(),
    remainingSec = durationSec,
  }: StartCycleTickOptions
): FactoryCycleTick => {
  const safeRemainingSec = Math.max(0, remainingSec);
  const cycleEndsAt = now + safeRemainingSec * 1000;

  return {
    cycleKey: current.cycleKey + 1,
    cycleDurationSec: durationSec,
    cycleEndsAt,
    isRunning: true,
    seconds: safeRemainingSec,
  };
};

/**
 * @example
 * advanceCycleBySeconds(tick, 10) // cycleEndsAt moved 10s earlier
 */
export const advanceCycleBySeconds = (
  tick: FactoryCycleTick,
  seconds: number
): FactoryCycleTick => {
  const cycleEndsAt = tick.cycleEndsAt - seconds * 1000;
  const remainingSec = Math.max(0, (cycleEndsAt - Date.now()) / 1000);

  return {
    ...tick,
    cycleEndsAt,
    seconds: remainingSec,
  };
};

/**
 * Syncs legacy `seconds` field from wall-clock anchor.
 */
export const syncCycleSeconds = (
  tick: FactoryCycleTick,
  now = Date.now()
): FactoryCycleTick => ({
  ...tick,
  seconds: getCycleRemainingSec(tick, now),
});
