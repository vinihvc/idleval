import { beforeEach, describe, expect, it } from "vitest";
import { getScaledFactoryConfig } from "@/game/balance";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { inventoryAtom } from "@/store/atoms/inventory";
import { missionsAtom } from "@/store/atoms/missions.atom";
import {
  applyOfflineEarning,
  offlineCycleProgressAtom,
  offlineSummaryAtom,
  reconcileManualProduction,
} from "@/store/atoms/offline-earning";
import { getLastSeenAt, sessionAtom } from "@/store/atoms/session";
import { getGold } from "@/store/atoms/wallet";
import { resetGame } from "@/store/reset";
import { seedFactory } from "@/store/test-utils";
import { D } from "@/utils/decimal";

describe("applyOfflineEarning", () => {
  beforeEach(() => {
    resetGame();
  });

  it("returns null and only touches session when away for less than 60 seconds", () => {
    const now = 100_000;
    store.set(sessionAtom, { lastSeenAt: now - 30_000 });
    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 2,
    });

    const result = applyOfflineEarning(now);

    expect(result).toBeNull();
    expect(getLastSeenAt()).toBe(now);
    expect(getGold().toNumber()).toBe(0);
  });

  it("applies automated gold and stores offline progress", () => {
    const now = 120_000;

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      isProducing: false,
      amount: 1,
    });
    store.set(sessionAtom, { lastSeenAt: 0 });

    const summary = applyOfflineEarning(now);

    expect(summary).not.toBeNull();
    expect(summary?.totalGold.gt(0)).toBe(true);
    expect(getGold().gt(0)).toBe(true);
    expect(store.get(offlineCycleProgressAtom).grain).toBeDefined();
    expect(getLastSeenAt()).toBe(now);
  });

  it("clears inconsistent manual producing without timestamps", () => {
    const now = 120_000;

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });
    store.set(factoriesAtom, (previous) => ({
      ...previous,
      wine: {
        ...previous.wine,
        isUnlocked: true,
        isProducing: true,
      },
    }));
    store.set(sessionAtom, { lastSeenAt: 0 });

    applyOfflineEarning(now);

    expect(store.get(factoriesAtom).wine.isProducing).toBe(false);
  });

  it("completes manual production offline and includes gold in summary", () => {
    const productionTime = getScaledFactoryConfig("wine").productionTime;
    const now = 120_000;
    const lastSeenAt = 0;
    const startedAt = now - productionTime * 1000;

    seedFactory("wine", {
      isUnlocked: true,
      isAutomated: false,
      isProducing: true,
      amount: 1,
      productionStartedAt: startedAt,
      productionDurationSec: productionTime,
    });
    store.set(sessionAtom, { lastSeenAt });

    const summary = applyOfflineEarning(now);

    expect(summary).not.toBeNull();
    expect(summary?.results.some((result) => result.factory === "wine")).toBe(
      true
    );
    expect(store.get(factoriesAtom).wine.isProducing).toBe(false);
    expect(getGold().gt(0)).toBe(true);
    expect(store.get(missionsAtom).counters.productionCyclesCompleted).toBe(1);
  });

  it("increments production cycle counter for automated offline cycles", () => {
    const productionTime = getScaledFactoryConfig("grain").productionTime;
    const elapsedSec = 120;
    const now = elapsedSec * 1000;
    const expectedCycles = Math.floor(elapsedSec / productionTime);

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });
    store.set(sessionAtom, { lastSeenAt: 0 });

    applyOfflineEarning(now);

    expect(store.get(missionsAtom).counters.productionCyclesCompleted).toBe(
      expectedCycles
    );
  });

  it("counts automated and manual offline cycles without double counting manual", () => {
    const grainProductionTime = getScaledFactoryConfig("grain").productionTime;
    const wineProductionTime = getScaledFactoryConfig("wine").productionTime;
    const elapsedSec = 120;
    const now = elapsedSec * 1000;
    const wineStartedAt = now - wineProductionTime * 1000;
    const expectedAutomatedCycles = Math.floor(
      elapsedSec / grainProductionTime
    );

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });
    seedFactory("wine", {
      isUnlocked: true,
      isAutomated: false,
      isProducing: true,
      amount: 1,
      productionStartedAt: wineStartedAt,
      productionDurationSec: wineProductionTime,
    });
    store.set(sessionAtom, { lastSeenAt: 0 });

    applyOfflineEarning(now);

    expect(store.get(missionsAtom).counters.productionCyclesCompleted).toBe(
      expectedAutomatedCycles + 1
    );
  });

  it("returns null when total offline gold is zero", () => {
    const now = 120_000;
    store.set(sessionAtom, { lastSeenAt: 0 });

    const summary = applyOfflineEarning(now);

    expect(summary).toBeNull();
    expect(store.get(offlineSummaryAtom)).toBeNull();
  });

  it("credits production when away for hours with an untouched lastSeenAt", () => {
    const threeHoursMs = 3 * 60 * 60 * 1000;
    const now = 10_000_000;
    const lastSeenAt = now - threeHoursMs;

    store.set(sessionAtom, { lastSeenAt });
    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 2,
    });

    const summary = applyOfflineEarning(now);

    expect(summary).not.toBeNull();
    expect(summary?.elapsedMs).toBe(threeHoursMs);
    expect(summary?.totalGold.gt(0)).toBe(true);
    expect(getGold().gt(0)).toBe(true);
    expect(getLastSeenAt()).toBe(now);
  });

  it("filters zero-cycle results from summary", () => {
    const now = 120_000;

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });
    store.set(sessionAtom, { lastSeenAt: 0 });

    const summary = applyOfflineEarning(now);

    expect(summary?.results.every((result) => result.cycles > 0)).toBe(true);
  });

  it("applies prorated lightning shard earnings and clears expired buffs", () => {
    const now = 20 * 60 * 1000;

    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });
    store.set(sessionAtom, { lastSeenAt: 0 });

    const baselineGold = applyOfflineEarning(now)?.totalGold;

    resetGame();
    seedFactory("grain", {
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    });
    store.set(sessionAtom, { lastSeenAt: 0 });
    store.set(inventoryAtom, (previous) => ({
      ...previous,
      activePowerUp: {
        expiresAt: 5 * 60 * 1000,
        powerUpId: "lightningShard",
        tier: "rare",
      },
    }));

    const boosted = applyOfflineEarning(now);

    expect(boosted?.totalGold.gt(baselineGold ?? D(0))).toBe(true);
    expect(store.get(inventoryAtom).activePowerUp).toBeNull();
  });
});

describe("reconcileManualProduction", () => {
  beforeEach(() => {
    resetGame();
  });

  it("syncs partial manual progress without completing the cycle", () => {
    const productionTime = getScaledFactoryConfig("reliquary").productionTime;
    const now = 50_000;
    const startedAt = now - 30_000;

    seedFactory("reliquary", {
      isUnlocked: true,
      isAutomated: false,
      isProducing: true,
      amount: 1,
      productionStartedAt: startedAt,
      productionDurationSec: productionTime,
    });

    const completed = reconcileManualProduction(now);

    expect(completed).toHaveLength(0);
    expect(store.get(factoriesAtom).reliquary.isProducing).toBe(true);
    expect(store.get(offlineCycleProgressAtom).reliquary).toBe(
      productionTime - 30
    );
  });

  it("completes manual cycle and credits gold before offline threshold", () => {
    const productionTime = getScaledFactoryConfig("grain").productionTime;
    const now = 10_000;
    const startedAt = now - productionTime * 1000;

    seedFactory("grain", {
      isProducing: true,
      amount: 1,
      productionStartedAt: startedAt,
      productionDurationSec: productionTime,
    });

    const completed = reconcileManualProduction(now);

    expect(completed).toHaveLength(1);
    expect(completed[0]?.cycles).toBe(1);
    expect(store.get(factoriesAtom).grain.isProducing).toBe(false);
    expect(getGold().gt(0)).toBe(true);
  });
});
