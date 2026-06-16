import { describe, expect, it } from "vitest";
import { FACTORY_DATA, FACTORY_TYPES } from "@/content/factories";
import {
  createInitialFactoriesState,
  getFactoryEarnPerCycle,
} from "@/game/factories";
import {
  computeOfflineEarning,
  MIN_OFFLINE_MS,
  meetsMinimumOfflineDuration,
} from "@/game/offline-earning";
import type { ActivePowerUp } from "@/game/power-ups";
import { D } from "@/utils/decimal";

const grainFactory = () => {
  const factories = structuredClone(createInitialFactoriesState());
  factories.grain = {
    ...factories.grain,
    isAutomated: true,
    isUnlocked: true,
    amount: 1,
  };

  return factories;
};

const grainEarnPerCycle = () =>
  getFactoryEarnPerCycle({
    amount: 1,
    godsProductionMultiplier: D(1),
    isUpgraded: false,
    productionValue: FACTORY_DATA.grain.productionValue,
  });

describe("offline-earning", () => {
  it("meetsMinimumOfflineDuration at the 60s threshold", () => {
    expect(meetsMinimumOfflineDuration(MIN_OFFLINE_MS - 1)).toBe(false);
    expect(meetsMinimumOfflineDuration(MIN_OFFLINE_MS)).toBe(true);
  });

  it("returns empty results when lastSeenAt is null", () => {
    const result = computeOfflineEarning(
      Date.now(),
      null,
      createInitialFactoriesState(),
      D(1)
    );

    expect(result.elapsedMs).toBe(0);
    expect(result.totalGold.toNumber()).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("returns empty results when lastSeenAt is in the future", () => {
    const now = 1_000_000;
    const result = computeOfflineEarning(
      now,
      now + 1000,
      createInitialFactoriesState(),
      D(1)
    );

    expect(result.totalGold.toNumber()).toBe(0);
  });

  it("returns empty results when elapsed time is zero", () => {
    const now = 1_000_000;
    const result = computeOfflineEarning(
      now,
      now,
      createInitialFactoriesState(),
      D(1)
    );

    expect(result.elapsedMs).toBe(0);
    expect(result.totalGold.toNumber()).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("awards automated factories for elapsed offline time", () => {
    const factories = structuredClone(createInitialFactoriesState());
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
    const factories = structuredClone(createInitialFactoriesState());
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
    const factories = structuredClone(createInitialFactoriesState());
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
    const factories = structuredClone(createInitialFactoriesState());
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
    const factories = structuredClone(createInitialFactoriesState());
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
    const factories = structuredClone(createInitialFactoriesState());

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

  it("prorates lightning shard income for the buff window only", () => {
    const factories = grainFactory();
    const lastSeenAt = 0;
    const now = 20 * 60 * 1000;
    const activePowerUp: ActivePowerUp = {
      expiresAt: 5 * 60 * 1000,
      powerUpId: "lightningShard",
      tier: "rare",
    };
    const productionTime = FACTORY_DATA.grain.productionTime;
    const earnPerCycle = grainEarnPerCycle();
    const buffSec = 5 * 60;
    const normalSec = 15 * 60;
    const expectedGold = earnPerCycle
      .times(2)
      .times(Math.floor(buffSec / productionTime))
      .plus(earnPerCycle.times(Math.floor(normalSec / productionTime)));

    const baseline = computeOfflineEarning(now, lastSeenAt, factories, D(1));
    const boosted = computeOfflineEarning(
      now,
      lastSeenAt,
      factories,
      D(1),
      activePowerUp
    );

    expect(boosted.totalGold.eq(expectedGold)).toBe(true);
    expect(boosted.totalGold.gt(baseline.totalGold)).toBe(true);
  });

  it("prorates haste rune production speed for the buff window only", () => {
    const factories = grainFactory();
    const lastSeenAt = 0;
    const now = 20 * 60 * 1000;
    const activePowerUp: ActivePowerUp = {
      expiresAt: 5 * 60 * 1000,
      powerUpId: "hasteRune",
      tier: "uncommon",
    };
    const baseProductionTime = FACTORY_DATA.grain.productionTime;
    const buffProductionTime = Math.max(
      1,
      Math.round(baseProductionTime * 0.6)
    );
    const earnPerCycle = grainEarnPerCycle();
    const expectedGold = earnPerCycle
      .times(Math.floor((5 * 60) / buffProductionTime))
      .plus(earnPerCycle.times(Math.floor((15 * 60) / baseProductionTime)));

    const baseline = computeOfflineEarning(now, lastSeenAt, factories, D(1));
    const boosted = computeOfflineEarning(
      now,
      lastSeenAt,
      factories,
      D(1),
      activePowerUp
    );

    expect(boosted.totalGold.eq(expectedGold)).toBe(true);
    expect(boosted.totalGold.gt(baseline.totalGold)).toBe(true);
  });

  it("ignores an already-expired buff when computing offline earnings", () => {
    const factories = grainFactory();
    const lastSeenAt = 400_000;
    const now = 1_200_000;
    const activePowerUp: ActivePowerUp = {
      expiresAt: 300_000,
      powerUpId: "lightningShard",
      tier: "rare",
    };

    const baseline = computeOfflineEarning(now, lastSeenAt, factories, D(1));
    const withExpiredBuff = computeOfflineEarning(
      now,
      lastSeenAt,
      factories,
      D(1),
      activePowerUp
    );

    expect(withExpiredBuff.totalGold.eq(baseline.totalGold)).toBe(true);
  });
});
