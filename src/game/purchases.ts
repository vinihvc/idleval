import type { GameValue } from "@/utils/decimal";
import { bulkBuyCost, canAfford, maxAffordable, unitCost } from "./economy";
import type { PurchaseAmount } from "./types";

/**
 * Coerces persisted/UI values into a supported purchase mode.
 *
 * @example
 * normalizePurchaseAmount("max") // "max"
 * normalizePurchaseAmount("10") // 10
 * normalizePurchaseAmount(null) // 1
 */
export const normalizePurchaseAmount = (amount: unknown): PurchaseAmount => {
  if (amount === "max") {
    return "max";
  }

  if (amount === 10 || amount === "10") {
    return 10;
  }

  if (amount === 50 || amount === "50") {
    return 50;
  }

  return 1;
};

interface PurchaseInput {
  /** Selected buy mode chosen by the player. */
  amount: PurchaseAmount | unknown;
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
 *
 * @example
 * getPurchaseBudget(1, D(1000)).toNumber() // 1000
 * getPurchaseBudget(10, D(1000)).toNumber() // 100
 * getPurchaseBudget(50, D(1000)).toNumber() // 500
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
 *
 * @example
 * getAffordableUnitCount({ amount: 1, baseBuyCost: 10, gold: D(1000), owned: 0 }) // 1
 * getAffordableUnitCount({ amount: "max", baseBuyCost: 10, gold: D(1000), owned: 0 }) // 19
 * getAffordableUnitCount({ amount: 1, baseBuyCost: 75, gold: D(10), owned: 0 }) // 0
 */
export const getAffordableUnitCount = ({
  amount,
  baseBuyCost,
  gold,
  owned,
}: PurchaseInput): number => {
  const purchaseAmount = normalizePurchaseAmount(amount);
  const firstUnitCost = unitCost(baseBuyCost, owned);
  const canAffordOne = gold.gte(firstUnitCost);

  if (purchaseAmount === "max") {
    return maxAffordable(baseBuyCost, owned, gold);
  }

  if (purchaseAmount === 10 || purchaseAmount === 50) {
    const budget = getPurchaseBudget(purchaseAmount, gold);
    const affordableInBudget = maxAffordable(baseBuyCost, owned, budget);

    if (affordableInBudget > 0) {
      return affordableInBudget;
    }

    return canAffordOne ? 1 : 0;
  }

  return canAffordOne ? 1 : 0;
};

/**
 * Calculates the total price for buying a batch of factory units from the
 * current owned amount.
 *
 * @example
 * getPurchaseTotalCost(10, 0, 3).toNumber() // 34
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
 *
 * @example
 * canPurchaseUnits({ gold: D(100), quantity: 1, totalToPay: D(100) }) // true
 * canPurchaseUnits({ gold: D(99), quantity: 1, totalToPay: D(100) }) // false
 */
export const canPurchaseUnits = ({
  gold,
  quantity,
  totalToPay,
}: PurchaseUnitsInput): boolean => quantity > 0 && canAfford(gold, totalToPay);

/**
 * Whether the player can unlock a sealed factory.
 *
 * @example
 * canUnlockFactory(D(1000), 500) // true
 * canUnlockFactory(D(100), 500) // false
 */
export const canUnlockFactory = (
  gold: GameValue,
  unlockPrice: number | GameValue
): boolean => canAfford(gold, unlockPrice);

/**
 * Whether a factory is still sealed and cannot be unlocked yet.
 *
 * @example
 * isFactorySealed({ gold: D(100), isUnlocked: false, unlockPrice: 500 }) // true
 * isFactorySealed({ gold: D(1000), isUnlocked: false, unlockPrice: 500 }) // false
 */
export const isFactorySealed = ({
  gold,
  isUnlocked,
  unlockPrice,
}: FactoryUnlockInput): boolean =>
  !(isUnlocked || canUnlockFactory(gold, unlockPrice));
