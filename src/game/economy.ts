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
 */
export const unitCost = (baseBuyCost: number, owned: number): GameValue =>
  D(baseBuyCost).times(Decimal.pow(UNIT_COST_RATE, owned));

/**
 * Total cost to buy `quantity` units starting from `owned` units.
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
 * Manager cost is a fixed milestone per factory tier.
 */
export const managerCost = (baseBuyCost: number, _owned: number): GameValue =>
  D(baseBuyCost).times(ECONOMY.managerBaseFactor);

/**
 * Upgrade cost is a fixed milestone per factory tier.
 */
export const upgradeCost = (baseBuyCost: number, _owned: number): GameValue =>
  D(baseBuyCost).times(ECONOMY.upgradeBaseFactor);

/**
 * Whether the player has enough gold to pay a given price.
 */
export const canAfford = (
  gold: GameValue,
  price: number | GameValue
): boolean => gold.gte(D(price));
