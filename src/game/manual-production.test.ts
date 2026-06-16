import { describe, expect, it } from "vitest";
import { createInitialFactoryState } from "@/game/factories";
import {
  clearManualProductionFields,
  reconcileManualCycle,
} from "@/game/manual-production";

const manualProducing = (
  startedAt: number,
  durationSec: number,
  overrides: Partial<ReturnType<typeof createInitialFactoryState>> = {}
) => ({
  ...createInitialFactoryState("grain"),
  isProducing: true,
  productionStartedAt: startedAt,
  productionDurationSec: durationSec,
  ...overrides,
});

describe("reconcileManualCycle", () => {
  it("returns idle when not producing", () => {
    expect(
      reconcileManualCycle(createInitialFactoryState("grain"), 10_000)
    ).toEqual({ kind: "idle" });
  });

  it("returns idle for automated factories", () => {
    expect(
      reconcileManualCycle(
        manualProducing(0, 10, { isAutomated: true }),
        20_000
      )
    ).toEqual({ kind: "idle" });
  });

  it("returns idle when timestamps are missing", () => {
    expect(
      reconcileManualCycle(
        {
          ...createInitialFactoryState("grain"),
          isProducing: true,
          productionStartedAt: null,
          productionDurationSec: null,
        },
        20_000
      )
    ).toEqual({ kind: "idle" });
  });

  it("returns complete when elapsed time meets duration", () => {
    expect(reconcileManualCycle(manualProducing(0, 10), 10_000)).toEqual({
      kind: "complete",
    });
  });

  it("returns complete when elapsed time exceeds duration", () => {
    expect(reconcileManualCycle(manualProducing(0, 10), 25_000)).toEqual({
      kind: "complete",
    });
  });

  it("returns in_progress with remaining seconds for partial cycles", () => {
    expect(reconcileManualCycle(manualProducing(0, 80), 30_000)).toEqual({
      kind: "in_progress",
      secondsRemaining: 50,
    });
  });

  it("uses full duration when now is before startedAt", () => {
    expect(reconcileManualCycle(manualProducing(50_000, 40), 10_000)).toEqual({
      kind: "in_progress",
      secondsRemaining: 40,
    });
  });

  it("ceil partial seconds and never returns zero while in progress", () => {
    expect(reconcileManualCycle(manualProducing(0, 10), 9500)).toEqual({
      kind: "in_progress",
      secondsRemaining: 1,
    });
  });
});

describe("clearManualProductionFields", () => {
  it("clears manual cycle fields", () => {
    const cleared = clearManualProductionFields(
      manualProducing(100, 10, { amount: 3 })
    );

    expect(cleared.isProducing).toBe(false);
    expect(cleared.productionStartedAt).toBeNull();
    expect(cleared.productionDurationSec).toBeNull();
    expect(cleared.amount).toBe(3);
  });
});
