import { describe, expect, it } from "vitest";
import { bulkBuyCost, maxAffordable, unitCost } from "@/game/economy";
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

  it("maxAffordable returns zero when gold is insufficient", () => {
    expect(maxAffordable(10, 0, D(0))).toBe(0);
    expect(maxAffordable(10, 0, D(5))).toBe(0);
  });

  it("maxAffordable returns at least one when gold covers first unit", () => {
    expect(maxAffordable(10, 0, D(10))).toBe(1);
    expect(maxAffordable(10, 0, D(100))).toBeGreaterThan(1);
  });
});
