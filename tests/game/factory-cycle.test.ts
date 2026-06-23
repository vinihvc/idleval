import { describe, expect, it } from "vitest";
import {
  advanceCycleBySeconds,
  type FactoryCycleTick,
  getCycleProgress,
  getCycleRemainingSec,
  isCycleComplete,
  startCycleTick,
  syncCycleSeconds,
} from "./factory-cycle";

const baseTick = (): FactoryCycleTick => ({
  cycleKey: 1,
  cycleDurationSec: 60,
  cycleEndsAt: 0,
  isRunning: false,
  seconds: 60,
});

describe("factory-cycle", () => {
  it("startCycleTick creates wall-clock anchors for a full cycle", () => {
    const now = 1_000_000;
    const tick = startCycleTick(baseTick(), { durationSec: 60, now });

    expect(tick.cycleKey).toBe(2);
    expect(tick.isRunning).toBe(true);
    expect(tick.cycleDurationSec).toBe(60);
    expect(tick.cycleEndsAt).toBe(now + 60_000);
    expect(tick.seconds).toBe(60);
  });

  it("startCycleTick supports partial remaining time", () => {
    const now = 2_000_000;
    const tick = startCycleTick(baseTick(), {
      durationSec: 60,
      now,
      remainingSec: 12,
    });

    expect(tick.cycleEndsAt).toBe(now + 12_000);
    expect(getCycleProgress(tick, now)).toEqual({
      durationSec: 60,
      progress: 0.8,
      remainingSec: 12,
    });
  });

  it("getCycleProgress clamps progress between 0 and 1", () => {
    const now = 5000;
    const tick: FactoryCycleTick = {
      cycleKey: 2,
      cycleDurationSec: 10,
      cycleEndsAt: now + 2500,
      isRunning: true,
      seconds: 2.5,
    };

    expect(getCycleProgress(tick, now)).toEqual({
      durationSec: 10,
      progress: 0.75,
      remainingSec: 2.5,
    });
  });

  it("isCycleComplete returns true when wall clock passes cycleEndsAt", () => {
    const tick: FactoryCycleTick = {
      ...baseTick(),
      cycleEndsAt: 10_000,
      isRunning: true,
    };

    expect(isCycleComplete(tick, 9999)).toBe(false);
    expect(isCycleComplete(tick, 10_000)).toBe(true);
    expect(isCycleComplete(tick, 11_000)).toBe(true);
  });

  it("advanceCycleBySeconds moves cycleEndsAt earlier", () => {
    const now = Date.now();
    const tick: FactoryCycleTick = {
      cycleKey: 2,
      cycleDurationSec: 60,
      cycleEndsAt: now + 30_000,
      isRunning: true,
      seconds: 30,
    };

    const advanced = advanceCycleBySeconds(tick, 10);

    expect(advanced.cycleEndsAt).toBe(tick.cycleEndsAt - 10_000);
    expect(getCycleRemainingSec(advanced)).toBeCloseTo(20, 0);
  });

  it("syncCycleSeconds updates seconds from cycleEndsAt", () => {
    const now = 8000;
    const tick: FactoryCycleTick = {
      cycleKey: 2,
      cycleDurationSec: 60,
      cycleEndsAt: now + 15_500,
      isRunning: true,
      seconds: 99,
    };

    const synced = syncCycleSeconds(tick, now);

    expect(synced.seconds).toBe(15.5);
  });
});
