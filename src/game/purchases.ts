import type { GameValue } from "@/utils/decimal";
import { bulkBuyCost, canAfford, maxAffordable, unitCost } from "./economy";
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
  const firstUnitCost = unitCost(baseBuyCost, owned);

  if (amount === "max") {
    return maxAffordable(baseBuyCost, owned, gold);
  }

  if (amount === 10 || amount === 50) {
    const budget = getPurchaseBudget(amount, gold);
    const affordableInBudget = maxAffordable(baseBuyCost, owned, budget);

    // #region agent log
    if (typeof globalThis !== "undefined") {
      fetch(
        "http://127.0.0.1:7620/ingest/0d90553c-a60c-49af-9fa4-e621890cbf4b",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "ece29d",
          },
          body: JSON.stringify({
            sessionId: "ece29d",
            runId: "pre-fix",
            hypothesisId: "A-C",
            location: "purchases.ts:getAffordableUnitCount",
            message: "Percentage purchase calculation",
            data: {
              amount,
              amountType: typeof amount,
              gold: gold.toString(),
              budget: budget.toString(),
              owned,
              baseBuyCost,
              firstUnitCost: firstUnitCost.toString(),
              affordableInBudget,
              canAffordOne: gold.gte(firstUnitCost),
              result: affordableInBudget,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => undefined);
    }
    // #endregion

    return affordableInBudget;
  }

  const result = gold.gte(firstUnitCost) ? 1 : 0;

  // #region agent log
  if (typeof globalThis !== "undefined" && amount !== 1) {
    fetch("http://127.0.0.1:7620/ingest/0d90553c-a60c-49af-9fa4-e621890cbf4b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "ece29d",
      },
      body: JSON.stringify({
        sessionId: "ece29d",
        runId: "pre-fix",
        hypothesisId: "B",
        location: "purchases.ts:getAffordableUnitCount:fallback",
        message: "Non-percentage amount fell through to buy-1 mode",
        data: {
          amount,
          amountType: typeof amount,
          result,
          gold: gold.toString(),
          owned,
          baseBuyCost,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => undefined);
  }
  // #endregion

  return result;
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

interface PurchaseUnitsInput {
  gold: GameValue;
  quantity: number;
  totalToPay: GameValue;
}

interface FactoryUnlockInput {
  gold: GameValue;
  isUnlocked: boolean;
  unlockPrice: number | GameValue;
}

/**
 * Whether the player can buy a batch of factory units.
 */
export const canPurchaseUnits = ({
  gold,
  quantity,
  totalToPay,
}: PurchaseUnitsInput): boolean => quantity > 0 && canAfford(gold, totalToPay);

/**
 * Whether the player can unlock a sealed factory.
 */
export const canUnlockFactory = (
  gold: GameValue,
  unlockPrice: number | GameValue
): boolean => canAfford(gold, unlockPrice);

/**
 * Whether a factory is still sealed and cannot be unlocked yet.
 */
export const isFactorySealed = ({
  gold,
  isUnlocked,
  unlockPrice,
}: FactoryUnlockInput): boolean =>
  !(isUnlocked || canUnlockFactory(gold, unlockPrice));
