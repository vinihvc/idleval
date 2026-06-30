import { BALANCE_BASELINE } from "@/config/balance";
import { getScaledBaseBuyCost } from "@/game/balance";
import { applyDifficultyCost, getGameDifficulty } from "@/game/difficulty";
import { D, type GameValue } from "@/utils/decimal";

export const ECONOMY = {
  unitCostMultiplier: BALANCE_BASELINE.unitCostGrowth,
  managerBaseFactor: BALANCE_BASELINE.managerCostFactor,
  upgradeBaseFactor: BALANCE_BASELINE.upgradeCostFactor,
  upgradeProductionMultiplier: BALANCE_BASELINE.upgradeProductionMultiplier,
} as const;

const UNIT_COST_RATE = D(ECONOMY.unitCostMultiplier);

/**
 * Cost of the next single unit given how many are already owned.
 * Scales exponentially by unitCostGrowth per owned unit.
 *
 * @example
 * unitCost(10, 0).toNumber() // 10
 * unitCost(10, 1).toNumber() // 11.5
 */
export const unitCost = (
  baseBuyCost: number,
  owned: number,
  difficulty: number = getGameDifficulty()
): GameValue => {
  const scaledBase = getScaledBaseBuyCost(baseBuyCost);

  return applyDifficultyCost(
    D(scaledBase).times(UNIT_COST_RATE.pow(owned)),
    difficulty
  );
};

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
  quantity: number,
  difficulty: number = getGameDifficulty()
): GameValue => {
  if (quantity <= 0) {
    return D(0);
  }

  const scaledBase = getScaledBaseBuyCost(baseBuyCost);
  const firstUnitCost = D(scaledBase).times(UNIT_COST_RATE.pow(owned));
  const growth = UNIT_COST_RATE.pow(quantity).minus(1);

  return applyDifficultyCost(
    firstUnitCost.times(growth).div(UNIT_COST_RATE.minus(1)).floor(),
    difficulty
  );
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
  gold: GameValue,
  difficulty: number = getGameDifficulty()
): number => {
  if (gold.lte(0)) {
    return 0;
  }

  const firstUnitCost = unitCost(baseBuyCost, owned, difficulty);

  if (gold.lt(firstUnitCost)) {
    return 0;
  }

  const scaledBase = getScaledBaseBuyCost(baseBuyCost);
  const unitCostSumFactor = applyDifficultyCost(
    D(scaledBase).times(UNIT_COST_RATE.pow(owned)).div(UNIT_COST_RATE.minus(1)),
    difficulty
  );

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
export const managerCost = (
  baseBuyCost: number,
  _owned: number,
  difficulty: number = getGameDifficulty()
): GameValue =>
  applyDifficultyCost(
    D(getScaledBaseBuyCost(baseBuyCost)).times(ECONOMY.managerBaseFactor),
    difficulty
  );

/**
 * Upgrade cost is a fixed milestone per factory tier (base × upgrade factor).
 *
 * @example
 * upgradeCost(75, 0).toNumber() // 54400 at mild balance
 */
export const upgradeCost = (
  baseBuyCost: number,
  _owned: number,
  difficulty: number = getGameDifficulty()
): GameValue =>
  applyDifficultyCost(
    D(getScaledBaseBuyCost(baseBuyCost)).times(ECONOMY.upgradeBaseFactor),
    difficulty
  );

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
