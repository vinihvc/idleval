import { describe, expect, it } from "vitest";
import {
  canPurchaseUnits,
  canUnlockFactory,
  getAffordableUnitCount,
  getPurchaseBudget,
  getPurchaseTotalCost,
  isFactorySealed,
  normalizePurchaseAmount,
} from "@/game/purchases";
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

  it("10% buys at least one when budget is too small but gold covers one unit", () => {
    expect(
      getAffordableUnitCount({
        amount: 10,
        baseBuyCost: 75,
        gold: D(150),
        owned: 0,
      })
    ).toBe(1);
  });

  it("normalizes string percentage modes from persisted storage", () => {
    expect(
      getAffordableUnitCount({
        amount: "50",
        baseBuyCost: 75,
        gold: D(10_000),
        owned: 10,
      })
    ).toBeGreaterThan(1);
  });

  it("normalizePurchaseAmount coerces persisted values", () => {
    expect(normalizePurchaseAmount("max")).toBe("max");
    expect(normalizePurchaseAmount("10")).toBe(10);
    expect(normalizePurchaseAmount("50")).toBe(50);
    expect(normalizePurchaseAmount(10)).toBe(10);
    expect(normalizePurchaseAmount(50)).toBe(50);
    expect(normalizePurchaseAmount(null)).toBe(1);
    expect(normalizePurchaseAmount("invalid")).toBe(1);
    expect(normalizePurchaseAmount(undefined)).toBe(1);
  });

  it("getPurchaseBudget returns full gold or percentage slices", () => {
    const gold = D(1000);

    expect(getPurchaseBudget(1, gold).toNumber()).toBe(1000);
    expect(getPurchaseBudget(10, gold).toNumber()).toBe(100);
    expect(getPurchaseBudget(50, gold).toNumber()).toBe(500);
    expect(getPurchaseBudget("max", gold).toNumber()).toBe(1000);
  });

  it("returns zero units when gold cannot afford one unit", () => {
    expect(
      getAffordableUnitCount({
        amount: 1,
        baseBuyCost: 75,
        gold: D(10),
        owned: 0,
      })
    ).toBe(0);
  });

  it("canPurchaseUnits requires positive quantity and enough gold", () => {
    expect(
      canPurchaseUnits({
        gold: D(100),
        quantity: 0,
        totalToPay: D(10),
      })
    ).toBe(false);

    expect(
      canPurchaseUnits({
        gold: D(100),
        quantity: 1,
        totalToPay: D(100),
      })
    ).toBe(true);

    expect(
      canPurchaseUnits({
        gold: D(99),
        quantity: 1,
        totalToPay: D(100),
      })
    ).toBe(false);
  });

  it("canUnlockFactory checks gold against unlock price", () => {
    expect(canUnlockFactory(D(1000), 500)).toBe(true);
    expect(canUnlockFactory(D(100), 500)).toBe(false);
  });

  it("isFactorySealed reflects unlock and affordability", () => {
    expect(
      isFactorySealed({
        gold: D(100),
        isUnlocked: true,
        unlockPrice: 500,
      })
    ).toBe(false);

    expect(
      isFactorySealed({
        gold: D(1000),
        isUnlocked: false,
        unlockPrice: 500,
      })
    ).toBe(false);

    expect(
      isFactorySealed({
        gold: D(100),
        isUnlocked: false,
        unlockPrice: 500,
      })
    ).toBe(true);
  });
});
