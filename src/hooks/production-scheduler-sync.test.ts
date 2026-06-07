import { describe, expect, it } from "vitest";
import { FACTORIES, type FactoryType } from "@/content/factories";
import {
  syncActiveFactoryTick,
  syncInactiveFactoryTick,
} from "@/hooks/production-scheduler-sync";

describe("production-scheduler-sync", () => {
  const baseTick = {
    cycleKey: 1,
    isRunning: false,
    seconds: FACTORIES.grain.productionTime,
  };

  it("syncActiveFactoryTick starts a stopped factory with production time", () => {
    const consumed = new Set<FactoryType>();
    const result = syncActiveFactoryTick("grain", baseTick, {}, consumed);

    expect(result.changed).toBe(true);
    expect(result.tick.isRunning).toBe(true);
    expect(result.tick.seconds).toBe(FACTORIES.grain.productionTime);
    expect(result.tick.cycleKey).toBe(2);
  });

  it("syncActiveFactoryTick consumes offline progress once", () => {
    const consumed = new Set<FactoryType>();
    const offlineProgress = { grain: 1.5 };

    const first = syncActiveFactoryTick(
      "grain",
      baseTick,
      offlineProgress,
      consumed
    );
    const second = syncActiveFactoryTick(
      "grain",
      first.tick,
      offlineProgress,
      consumed
    );

    expect(first.changed).toBe(true);
    expect(first.clearOfflineProgress).toBe(true);
    expect(first.tick.seconds).toBe(1.5);
    expect(second.changed).toBe(false);
  });

  it("syncInactiveFactoryTick stops running ticks", () => {
    const runningTick = { ...baseTick, isRunning: true, seconds: 2 };
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
