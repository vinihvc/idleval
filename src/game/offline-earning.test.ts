import { describe, expect, it } from "vitest";
import { FACTORY_DATA, FACTORY_TYPES } from "@/content/factories";
import {
  computeOfflineEarning,
  MIN_OFFLINE_MS,
  meetsMinimumOfflineDuration,
} from "@/game/offline-earning";
import { initialData } from "@/store/atoms/factories.atom";
import { D } from "@/utils/decimal";

describe("offline-earning", () => {
  it("meetsMinimumOfflineDuration at the 60s threshold", () => {
    expect(meetsMinimumOfflineDuration(MIN_OFFLINE_MS - 1)).toBe(false);
    expect(meetsMinimumOfflineDuration(MIN_OFFLINE_MS)).toBe(true);
  });

  it("returns empty results when lastSeenAt is null", () => {
    const result = computeOfflineEarning(Date.now(), null, initialData, D(1));

    expect(result.elapsedMs).toBe(0);
    expect(result.totalGold.toNumber()).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("returns empty results when lastSeenAt is in the future", () => {
    const now = 1_000_000;
    const result = computeOfflineEarning(now, now + 1000, initialData, D(1));

    expect(result.totalGold.toNumber()).toBe(0);
  });

  it("returns empty results when elapsed time is zero", () => {
    const now = 1_000_000;
    const result = computeOfflineEarning(now, now, initialData, D(1));

    expect(result.elapsedMs).toBe(0);
    expect(result.totalGold.toNumber()).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("awards automated factories for elapsed offline time", () => {
    const factories = structuredClone(initialData);
    factories.grain = {
      ...factories.grain,
      isAutomated: true,
      isUnlocked: true,
      amount: 2,
    };

    const productionTime = FACTORY_DATA.grain.productionTime;
    const cycles = 3;
    const elapsedMs = productionTime * cycles * 1000;
    const lastSeenAt = 0;
    const now = elapsedMs;

    const result = computeOfflineEarning(now, lastSeenAt, factories, D(1));
    const grain = result.results.find((entry) => entry.factory === "grain");

    expect(grain?.cycles).toBe(cycles);
    expect(result.totalGold.gt(0)).toBe(true);
  });

  it("skips locked and non-automated factories", () => {
    const factories = structuredClone(initialData);
    factories.grain = {
      ...factories.grain,
      isAutomated: false,
      isUnlocked: true,
      amount: 2,
    };
    factories.wine = {
      ...factories.wine,
      isAutomated: true,
      isUnlocked: false,
      amount: 1,
    };

    const elapsedMs = 120_000;
    const result = computeOfflineEarning(elapsedMs, 0, factories, D(1));

    expect(result.results).toHaveLength(0);
    expect(result.totalGold.toNumber()).toBe(0);
  });

  it("sums multiple automated factories into totalGold", () => {
    const factories = structuredClone(initialData);
    factories.grain = {
      ...factories.grain,
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    };
    factories.wine = {
      ...factories.wine,
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    };

    const elapsedMs = 120_000;
    const result = computeOfflineEarning(elapsedMs, 0, factories, D(1));
    const expectedTotal = result.results.reduce(
      (sum, entry) => sum.plus(entry.goldEarned),
      D(0)
    );

    expect(result.results.length).toBeGreaterThanOrEqual(2);
    expect(result.totalGold.eq(expectedTotal)).toBe(true);
  });

  it("calculates secondsRemaining for partial and complete cycles", () => {
    const factories = structuredClone(initialData);
    factories.grain = {
      ...factories.grain,
      isAutomated: true,
      isUnlocked: true,
      amount: 1,
    };

    const productionTime = FACTORY_DATA.grain.productionTime;
    const partialElapsedMs = (productionTime + 1) * 1000;
    const partial = computeOfflineEarning(partialElapsedMs, 0, factories, D(1));
    const grainPartial = partial.results.find(
      (entry) => entry.factory === "grain"
    );

    expect(grainPartial?.cycles).toBe(1);
    expect(grainPartial?.secondsRemaining).toBe(productionTime - 1);

    const completeElapsedMs = productionTime * 2 * 1000;
    const complete = computeOfflineEarning(
      completeElapsedMs,
      0,
      factories,
      D(1)
    );
    const grainComplete = complete.results.find(
      (entry) => entry.factory === "grain"
    );

    expect(grainComplete?.cycles).toBe(2);
    expect(grainComplete?.secondsRemaining).toBe(productionTime);
  });

  it("applies upgrade and god multipliers to offline earnings", () => {
    const factories = structuredClone(initialData);
    factories.grain = {
      ...factories.grain,
      isAutomated: true,
      isUnlocked: true,
      isUpgraded: true,
      amount: 1,
    };

    const elapsedMs = FACTORY_DATA.grain.productionTime * 1000;
    const base = computeOfflineEarning(elapsedMs, 0, factories, D(1));
    const boosted = computeOfflineEarning(elapsedMs, 0, factories, D(3));

    expect(boosted.totalGold.gt(base.totalGold)).toBe(true);
  });

  it("returns results in FACTORY_TYPES order", () => {
    const factories = structuredClone(initialData);

    for (const factory of FACTORY_TYPES) {
      factories[factory] = {
        ...factories[factory],
        isAutomated: true,
        isUnlocked: true,
        amount: 1,
      };
    }

    const result = computeOfflineEarning(120_000, 0, factories, D(1));
    const factoryOrder = result.results.map((entry) => entry.factory);

    expect(factoryOrder).toEqual(FACTORY_TYPES);
  });
});
