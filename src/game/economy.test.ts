import { describe, expect, it } from "vitest";
import {
  bulkBuyCost,
  canAfford,
  managerCost,
  maxAffordable,
  unitCost,
  upgradeCost,
} from "@/game/economy";
import { D } from "@/utils/decimal";

describe("economy", () => {
  it("unitCost scales with owned units", () => {
    const base = 10;
    const first = unitCost(base, 0);
    const second = unitCost(base, 1);

    expect(first.toNumber()).toBe(10);
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
    expect(maxAffordable(10, 0, D(5))).toBe(0);
  });

  it("maxAffordable returns at least one when gold covers first unit", () => {
    expect(maxAffordable(10, 0, D(10))).toBe(1);
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

    expect(managerCost(base, 0).toNumber()).toBe(base * 220);
    expect(upgradeCost(base, 0).toNumber()).toBe(base * 1000);
    expect(managerCost(base, 10).eq(managerCost(base, 0))).toBe(true);
    expect(upgradeCost(base, 10).eq(upgradeCost(base, 0))).toBe(true);
  });
});
