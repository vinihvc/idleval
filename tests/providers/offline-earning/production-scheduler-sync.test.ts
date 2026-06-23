import { describe, expect, it } from "vitest";
import type { FactoryType } from "@/content/factories";
import { getScaledFactoryConfig } from "@/game/balance";
import { getCycleProgress } from "@/game/factory-cycle";
import {
  syncActiveFactoryTick,
  syncInactiveFactoryTick,
} from "@/providers/offline-earning/production-scheduler-sync";

describe("production-scheduler-sync", () => {
  const grainProductionTime = getScaledFactoryConfig("grain").productionTime;
  const now = 1_700_000_000_000;
  const baseTick = {
    cycleDurationSec: grainProductionTime,
    cycleEndsAt: 0,
    cycleKey: 1,
    isRunning: false,
    seconds: grainProductionTime,
  };

  it("syncActiveFactoryTick starts a stopped factory with production time", () => {
    const consumed = new Set<FactoryType>();
    const result = syncActiveFactoryTick(
      "grain",
      baseTick,
      {},
      consumed,
      grainProductionTime,
      null,
      null,
      now
    );

    expect(result.changed).toBe(true);
    expect(result.tick.isRunning).toBe(true);
    expect(result.tick.seconds).toBe(grainProductionTime);
    expect(result.tick.cycleKey).toBe(2);
    expect(result.tick.cycleDurationSec).toBe(grainProductionTime);
    expect(result.tick.cycleEndsAt).toBe(now + grainProductionTime * 1000);
  });

  it("syncActiveFactoryTick uses persisted manual seconds when provided", () => {
    const consumed = new Set<FactoryType>();
    const productionTime = 60;
    const result = syncActiveFactoryTick(
      "grain",
      baseTick,
      {},
      consumed,
      productionTime,
      12,
      null,
      now
    );

    expect(result.changed).toBe(true);
    expect(result.tick.isRunning).toBe(true);
    expect(result.tick.seconds).toBe(12);
    expect(result.tick.cycleDurationSec).toBe(productionTime);
    expect(getCycleProgress(result.tick, now).progress).toBeCloseTo(
      1 - 12 / productionTime,
      5
    );
  });

  it("syncActiveFactoryTick prefers manual wall-clock anchor over ceil seconds", () => {
    const consumed = new Set<FactoryType>();
    const productionDurationSec = 60;
    const productionStartedAt = now - 48_500;
    const result = syncActiveFactoryTick(
      "grain",
      baseTick,
      {},
      consumed,
      grainProductionTime,
      12,
      { productionDurationSec, productionStartedAt },
      now
    );

    expect(result.tick.cycleDurationSec).toBe(productionDurationSec);
    expect(result.tick.seconds).toBeCloseTo(11.5, 1);
    expect(getCycleProgress(result.tick, now).progress).toBeCloseTo(
      1 - 11.5 / productionDurationSec,
      5
    );
  });

  it("syncActiveFactoryTick consumes offline progress once", () => {
    const consumed = new Set<FactoryType>();
    const offlineProgress = { grain: 1.5 };

    const first = syncActiveFactoryTick(
      "grain",
      baseTick,
      offlineProgress,
      consumed,
      grainProductionTime,
      null,
      null,
      now
    );
    const second = syncActiveFactoryTick(
      "grain",
      first.tick,
      offlineProgress,
      consumed,
      grainProductionTime,
      null,
      null,
      now
    );

    expect(first.changed).toBe(true);
    expect(first.clearOfflineProgress).toBe(true);
    expect(first.tick.seconds).toBe(1.5);
    expect(first.tick.cycleEndsAt).toBe(now + 1500);
    expect(getCycleProgress(first.tick, now).progress).toBeCloseTo(
      1 - 1.5 / grainProductionTime,
      5
    );
    expect(second.changed).toBe(false);
  });

  it("syncInactiveFactoryTick stops running ticks", () => {
    const runningTick = {
      ...baseTick,
      cycleEndsAt: now + 2000,
      isRunning: true,
      seconds: 2,
    };
    const consumed = new Set<FactoryType>(["grain"]);

    const result = syncInactiveFactoryTick("grain", runningTick, consumed);

    expect(result.changed).toBe(true);
    expect(result.tick.isRunning).toBe(false);
    expect(consumed.has("grain")).toBe(false);
  });

  it("syncInactiveFactoryTick is a no-op when already stopped", () => {
    const consumed = new Set<FactoryType>();
    const result = syncInactiveFactoryTick("grain", baseTick, consumed);

    expect(result.changed).toBe(false);
    expect(result.tick).toEqual(baseTick);
  });
});
