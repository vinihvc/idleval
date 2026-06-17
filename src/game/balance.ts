import { GAME_BALANCE } from "@/config/balance";
import { FACTORY_DATA, type FactoryType } from "@/content/factories";
import { D } from "@/utils/decimal";

export interface ScaledFactoryConfig {
  baseBuyCost: number;
  productionTime: number;
  productionValue: number;
  unlockPrice: number;
}

/**
 * Scales per-unit gold before upgrades and god multipliers.
 *
 * @example
 * getScaledProductionValue(20) // 24
 */
export const getScaledProductionValue = (value: number): number =>
  Math.round(value * GAME_BALANCE.productionValue);

/**
 * Scales cycle duration; minimum 1 second.
 *
 * @example
 * getScaledProductionTime(2) // 2
 * getScaledProductionTime(5) // 5
 */
export const getScaledProductionTime = (time: number): number =>
  Math.max(1, Math.round(time * GAME_BALANCE.productionTime));

/**
 * Scales the factory unit base price.
 *
 * @example
 * getScaledBaseBuyCost(75) // 64
 */
export const getScaledBaseBuyCost = (cost: number): number =>
  Math.round(cost * GAME_BALANCE.baseBuyCost);

/**
 * Scales the gold required to unlock a sealed factory tier.
 *
 * @example
 * getScaledUnlockPrice(55_000) // 41250
 */
export const getScaledUnlockPrice = (price: number): number =>
  Math.round(price * GAME_BALANCE.unlockPrice);

/**
 * Returns balance-adjusted factory catalog values for runtime use.
 */
export const getScaledFactoryConfig = (
  factory: FactoryType
): ScaledFactoryConfig => {
  const raw = FACTORY_DATA[factory];

  return {
    productionValue: getScaledProductionValue(raw.productionValue),
    productionTime: getScaledProductionTime(raw.productionTime),
    baseBuyCost: getScaledBaseBuyCost(raw.baseBuyCost),
    unlockPrice: getScaledUnlockPrice(raw.unlockPrice),
  };
};

/**
 * Scales god invocation gold thresholds.
 *
 * @example
 * getScaledGodGoldRequired("1e12") // "8e11"
 */
export const getScaledGodGoldRequired = (raw: string): string =>
  D(raw).times(GAME_BALANCE.godGoldRequired).toString();
