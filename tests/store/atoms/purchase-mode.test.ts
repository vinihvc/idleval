import { beforeEach, describe, expect, it } from "vitest";
import { getPurchaseTotalCost } from "@/game/purchases";
import { store } from "@/providers/store";
import { getFactoryProgressDifficulty } from "@/store/atoms/progress-ease";
import { resetGame } from "@/store/reset";
import { seedGold } from "@/store/test-utils";
import { D } from "@/utils/decimal";
import {
  computePurchaseTotals,
  purchaseModeAtom,
  toggleAmountToBuy,
  totalCanBuyByAmount,
  totalToPayByAmount,
} from "./purchase-mode";

describe("purchase-mode", () => {
  beforeEach(() => {
    resetGame();
  });

  it("toggleAmountToBuy cycles 1 → 10 → 50 → max → 1", () => {
    expect(store.get(purchaseModeAtom).amountToBuy).toBe(1);

    toggleAmountToBuy();
    expect(store.get(purchaseModeAtom).amountToBuy).toBe(10);

    toggleAmountToBuy();
    expect(store.get(purchaseModeAtom).amountToBuy).toBe(50);

    toggleAmountToBuy();
    expect(store.get(purchaseModeAtom).amountToBuy).toBe("max");

    toggleAmountToBuy();
    expect(store.get(purchaseModeAtom).amountToBuy).toBe(1);
  });

  it("computePurchaseTotals returns affordable count and total cost", () => {
    const baseBuyCost = 75;
    const factoryDifficulty = getFactoryProgressDifficulty();
    const totals = computePurchaseTotals(1, D(1000), 0, baseBuyCost);
    const expectedTotal = getPurchaseTotalCost(
      baseBuyCost,
      0,
      totals.totalCanBuy,
      factoryDifficulty
    );

    expect(totals.totalCanBuy).toBe(1);
    expect(totals.totalToPay.toNumber()).toBe(expectedTotal.toNumber());
  });

  it("totalCanBuyByAmount and totalToPayByAmount use current wallet and factory", () => {
    seedGold(10_000);

    const count = totalCanBuyByAmount("grain", 1);
    const total = totalToPayByAmount("grain", 1);

    expect(count).toBeGreaterThan(0);
    expect(total.gt(0)).toBe(true);
    expect(total.lte(D(10_000))).toBe(true);
  });
});
