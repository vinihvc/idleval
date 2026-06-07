import { describe, expect, it } from "vitest";
import { FACTORY_DATA } from "@/content/factories.data";
import { FACTORY_TYPES } from "@/content/factories.types";
import { GOD_COUNT, GODS } from "@/content/gods";
import { D } from "@/utils/decimal";

describe("content invariants", () => {
  it("FACTORY_TYPES covers every factory definition", () => {
    expect(FACTORY_TYPES).toEqual(Object.keys(FACTORY_DATA));
  });

  it("factory definitions have positive production and cost values", () => {
    for (const factory of FACTORY_TYPES) {
      const definition = FACTORY_DATA[factory];

      expect(definition.productionTime).toBeGreaterThan(0);
      expect(definition.productionValue).toBeGreaterThan(0);
      expect(definition.baseBuyCost).toBeGreaterThan(0);
      expect(definition.unlockPrice).toBeGreaterThanOrEqual(0);
    }
  });

  it("unlock prices are non-decreasing across factory tiers", () => {
    let previousUnlockPrice = -1;

    for (const factory of FACTORY_TYPES) {
      const unlockPrice = FACTORY_DATA[factory].unlockPrice;

      expect(unlockPrice).toBeGreaterThanOrEqual(previousUnlockPrice);
      previousUnlockPrice = unlockPrice;
    }
  });

  it("god definitions have valid progression values", () => {
    expect(GOD_COUNT).toBe(GODS.length);

    let previousGold = D(0);

    for (const god of GODS) {
      expect(god.productionMultiplier).toBeGreaterThanOrEqual(1);

      const goldRequired = D(god.goldRequired);
      expect(goldRequired.gt(previousGold)).toBe(true);
      previousGold = goldRequired;
    }
  });
});
