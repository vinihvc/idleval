import Decimal from "break_infinity.js";
import { D, type GameValue } from "@/utils/decimal";

export const ECONOMY = {
  unitCostMultiplier: 1.15,
  managerBaseFactor: 220,
  upgradeBaseFactor: 1000,
  upgradeProductionMultiplier: 2,
} as const;

const UNIT_COST_RATE = D(ECONOMY.unitCostMultiplier);

/**
 * Cost of the next single unit given how many are already owned.
 * Scales exponentially by 1.15x per owned unit.
 *
 * @example
 * unitCost(10, 0).toNumber() // 10
 * unitCost(10, 1).toNumber() // 11.5
 */
export const unitCost = (baseBuyCost: number, owned: number): GameValue =>
  D(baseBuyCost).times(Decimal.pow(UNIT_COST_RATE, owned));

/**
 * Total cost to buy `quantity` units starting from `owned` units.
 *
 * @example
 * bulkBuyCost(10, 0, 0).toNumber() // 0
 * bulkBuyCost(10, 0, 3).toNumber() // 34 (10 + 11.5 + 12.65, floored)
 */
export const bulkBuyCost = (
  baseBuyCost: number,
  owned: number,
  quantity: number
): GameValue => {
  if (quantity <= 0) {
    return D(0);
  }

  const firstUnitCost = D(baseBuyCost).times(
    Decimal.pow(UNIT_COST_RATE, owned)
  );
  const growth = Decimal.pow(UNIT_COST_RATE, quantity).minus(1);

  return firstUnitCost.times(growth).div(UNIT_COST_RATE.minus(1)).floor();
};

/**
 * Maximum number of units affordable with `gold` starting from `owned` units.
 *
 * @example
 * maxAffordable(10, 0, D(5)) // 0
 * maxAffordable(10, 0, D(10)) // 1
 * maxAffordable(10, 0, D(100)) // 6
 */
export const maxAffordable = (
  baseBuyCost: number,
  owned: number,
  gold: GameValue
): number => {
  if (gold.lte(0)) {
    return 0;
  }

  const firstUnitCost = unitCost(baseBuyCost, owned);

  if (gold.lt(firstUnitCost)) {
    return 0;
  }

  const unitCostSumFactor = D(baseBuyCost)
    .times(Decimal.pow(UNIT_COST_RATE, owned))
    .div(UNIT_COST_RATE.minus(1));

  const affordable = gold
    .div(unitCostSumFactor)
    .plus(1)
    .log(ECONOMY.unitCostMultiplier);

  return Math.max(0, Math.floor(affordable));
};

/**
 * Manager cost is a fixed milestone per factory tier (base × 220).
 *
 * @example
 * managerCost(75, 0).toNumber() // 16500
 */
export const managerCost = (baseBuyCost: number, _owned: number): GameValue =>
  D(baseBuyCost).times(ECONOMY.managerBaseFactor);

/**
 * Upgrade cost is a fixed milestone per factory tier (base × 1000).
 *
 * @example
 * upgradeCost(75, 0).toNumber() // 75000
 */
export const upgradeCost = (baseBuyCost: number, _owned: number): GameValue =>
  D(baseBuyCost).times(ECONOMY.upgradeBaseFactor);

/**
 * Whether the player has enough gold to pay a given price.
 *
 * @example
 * canAfford(D(100), 99) // true
 * canAfford(D(100), 101) // false
 */
export const canAfford = (
  gold: GameValue,
  price: number | GameValue
): boolean => gold.gte(D(price));
