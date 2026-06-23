import { describe, expect, it } from "vitest";
import { FACTORY_DATA } from "@/content/factories";
import { GAME_BALANCE } from "@/config/balance";
import { getScaledBaseBuyCost } from "@/game/balance";
import {
  bulkBuyCost,
  canAfford,
  managerCost,
  maxAffordable,
  unitCost,
  upgradeCost,
} from "@/game/economy";
import {
  createInitialFactoryState,
  getFactoryGoldPerSecond,
} from "@/game/factories";
import { D } from "@/utils/decimal";

describe("economy", () => {
  it("unitCost scales with owned units", () => {
    const base = 10;
    const scaledBase = getScaledBaseBuyCost(base);
    const first = unitCost(base, 0);
    const second = unitCost(base, 1);

    expect(first.toNumber()).toBe(scaledBase);
    expect(second.gt(first)).toBe(true);
  });

  it("bulkBuyCost returns zero for non-positive quantity", () => {
    expect(bulkBuyCost(10, 0, 0).toNumber()).toBe(0);
    expect(bulkBuyCost(10, 0, -1).toNumber()).toBe(0);
  });

  it("bulkBuyCost is floored and positive for valid quantity", () => {
    const base = 10;
    const owned = 2;
    const quantity = 3;
    const bulk = bulkBuyCost(base, owned, quantity);

    expect(bulk.gt(0)).toBe(true);
    expect(
      bulk.lte(
        unitCost(base, owned)
          .plus(unitCost(base, owned + 1))
          .plus(unitCost(base, owned + 2))
      )
    ).toBe(true);
  });

  it("bulkBuyCost equals sum of individual unit costs", () => {
    const base = 75;
    const owned = 5;
    const quantity = 4;
    let sum = D(0);

    for (let index = 0; index < quantity; index++) {
      sum = sum.plus(unitCost(base, owned + index));
    }

    expect(bulkBuyCost(base, owned, quantity).lte(sum)).toBe(true);
    expect(sum.minus(bulkBuyCost(base, owned, quantity)).lt(quantity)).toBe(
      true
    );
  });

  it("maxAffordable returns zero when gold is insufficient", () => {
    expect(maxAffordable(10, 0, D(0))).toBe(0);
    expect(maxAffordable(10, 0, D(3))).toBe(0);
  });

  it("maxAffordable returns at least one when gold covers first unit", () => {
    expect(maxAffordable(10, 0, D(getScaledBaseBuyCost(10)))).toBe(1);
    expect(maxAffordable(10, 0, D(100))).toBeGreaterThan(1);
  });

  it("maxAffordable is consistent with bulkBuyCost boundaries", () => {
    const base = 10;
    const owned = 3;
    const gold = D(500);
    const affordable = maxAffordable(base, owned, gold);

    expect(bulkBuyCost(base, owned, affordable).lte(gold)).toBe(true);
    expect(bulkBuyCost(base, owned, affordable + 1).gt(gold)).toBe(true);
  });

  it("canAfford checks gold against price", () => {
    expect(canAfford(D(100), 100)).toBe(true);
    expect(canAfford(D(100), 99)).toBe(true);
    expect(canAfford(D(100), 101)).toBe(false);
    expect(canAfford(D(50), D(50))).toBe(true);
  });

  it("managerCost and upgradeCost scale base buy cost", () => {
    const base = 75;
    const scaledBase = getScaledBaseBuyCost(base);

    expect(managerCost(base, 0).toNumber()).toBe(
      scaledBase * GAME_BALANCE.managerCostFactor
    );
    expect(upgradeCost(base, 0).toNumber()).toBe(
      scaledBase * GAME_BALANCE.upgradeCostFactor
    );
    expect(managerCost(base, 10).eq(managerCost(base, 0))).toBe(true);
    expect(upgradeCost(base, 10).eq(upgradeCost(base, 0))).toBe(true);
  });

  it("maxAffordable stays consistent with bulkBuyCost when difficulty is applied", () => {
    const base = 10;
    const owned = 3;
    const gold = D(500);
    const affordable = maxAffordable(base, owned, gold);

    expect(bulkBuyCost(base, owned, affordable).lte(gold)).toBe(true);
    expect(bulkBuyCost(base, owned, affordable + 1).gt(gold)).toBe(true);
  });

  it("reliquary next-unit payback stays under ten minutes at fifty units", () => {
    const owned = 50;
    const state = {
      ...createInitialFactoryState("reliquary", { amount: owned }),
      isUnlocked: true,
      isAutomated: true,
    };
    const nextCost = unitCost(FACTORY_DATA.reliquary.baseBuyCost, owned);
    const incomePerSecond = getFactoryGoldPerSecond(
      "reliquary",
      state,
      D(1),
      { factoryDifficulty: 1 }
    );
    const paybackSeconds = nextCost.div(incomePerSecond).toNumber();

    expect(paybackSeconds).toBeLessThan(10 * 60);
  });
});
