import { describe, expect, it } from "vitest";
import { getAffordableUnitCount } from "@/game/purchases";
import { D } from "@/utils/decimal";

describe("purchase mode debug", () => {
  it("compares modes at typical game values", () => {
    const cases = [
      { gold: 1000, base: 75, owned: 5 },
      { gold: 10_000, base: 75, owned: 10 },
      { gold: 55_000, base: 1125, owned: 0 },
      { gold: 500, base: 75, owned: 0 },
    ];

    for (const testCase of cases) {
      const results = [1, 10, 50, "max"].map((amount) =>
        getAffordableUnitCount({
          amount: amount as 1 | 10 | 50 | "max",
          baseBuyCost: testCase.base,
          gold: D(testCase.gold),
          owned: testCase.owned,
        })
      );

      // eslint-disable-next-line no-console
      console.log({ ...testCase, results });

      expect(results[0]).toBeGreaterThanOrEqual(0);
    }
  });

  it("10% returns 0 when budget cannot afford one unit but full gold can", () => {
    const count = getAffordableUnitCount({
      amount: 10,
      baseBuyCost: 75,
      gold: D(500),
      owned: 0,
    });

    expect(count).toBe(0);
  });

  it("string amount falls through to buy-1 mode", () => {
    const count = getAffordableUnitCount({
      amount: "50" as unknown as 50,
      baseBuyCost: 75,
      gold: D(10_000),
      owned: 10,
    });

    expect(count).toBe(1);
  });
});
