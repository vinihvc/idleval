import type { GameValue } from "@/utils/decimal";
import { bulkBuyCost, maxAffordable, unitCost } from "./economy";
import type { PurchaseAmount } from "./types";

interface PurchaseInput {
  /** Selected buy mode chosen by the player. */
  amount: PurchaseAmount;
  /** Base price for the factory before exponential scaling. */
  baseBuyCost: number;
  /** Current gold balance available to spend. */
  gold: GameValue;
  /** Number of factory units already owned. */
  owned: number;
}

/**
 * Converts the selected buy mode into the amount of gold available for this
 * purchase attempt.
 */
export const getPurchaseBudget = (
  amount: PurchaseAmount,
  gold: GameValue
): GameValue => {
  if (amount === 10) {
    return gold.div(10);
  }

  if (amount === 50) {
    return gold.div(2);
  }

  return gold;
};

/**
 * Calculates how many factory units the player can buy for the selected buy
 * mode and current wallet balance.
 */
export const getAffordableUnitCount = ({
  amount,
  baseBuyCost,
  gold,
  owned,
}: PurchaseInput): number => {
  if (amount === "max") {
    return maxAffordable(baseBuyCost, owned, gold);
  }

  if (amount === 10 || amount === 50) {
    const budget = getPurchaseBudget(amount, gold);

    return maxAffordable(baseBuyCost, owned, budget);
  }

  return gold.gte(unitCost(baseBuyCost, owned)) ? 1 : 0;
};

/**
 * Calculates the total price for buying a batch of factory units from the
 * current owned amount.
 */
export const getPurchaseTotalCost = (
  baseBuyCost: number,
  owned: number,
  quantity: number
): GameValue => bulkBuyCost(baseBuyCost, owned, quantity);
