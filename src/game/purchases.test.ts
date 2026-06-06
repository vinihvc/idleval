import { describe, expect, it } from "vitest";
import { getAffordableUnitCount, getPurchaseTotalCost } from "@/game/purchases";
import { D } from "@/utils/decimal";

describe("purchases", () => {
  const input = {
    baseBuyCost: 10,
    owned: 0,
    gold: D(1000),
  };

  it("buys one unit in unit mode when affordable", () => {
    expect(getAffordableUnitCount({ ...input, amount: 1 })).toBe(1);
  });

  it("uses 10% budget for amount 10", () => {
    const count = getAffordableUnitCount({ ...input, amount: 10 });
    const total = getPurchaseTotalCost(input.baseBuyCost, input.owned, count);

    expect(total.lte(input.gold.div(10))).toBe(true);
  });

  it("uses 50% budget for amount 50", () => {
    const count = getAffordableUnitCount({ ...input, amount: 50 });
    const total = getPurchaseTotalCost(input.baseBuyCost, input.owned, count);

    expect(total.lte(input.gold.div(2))).toBe(true);
  });

  it("max mode spends all affordable gold", () => {
    const count = getAffordableUnitCount({ ...input, amount: "max" });
    const total = getPurchaseTotalCost(input.baseBuyCost, input.owned, count);

    expect(count).toBeGreaterThan(0);
    expect(total.lte(input.gold)).toBe(true);
  });
});
