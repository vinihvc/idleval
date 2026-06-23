import type { FactoryType } from "@/content/factories";
import { getFactoryEarnPerCycle } from "@/game/factories";
import type { GameValue } from "@/utils/decimal";
import { getFactory } from "./factories.selectors";
import { getGodsProductionMultiplier } from "./gods";
import { getPowerUpIncomeMultiplierForEarn } from "./inventory";
import { getMissionRenownProductionMultiplier } from "./missions.selectors";
import { getFactoryProgressDifficulty } from "./progress-ease";

interface TotalEarnPerCycleOptions {
  amount?: number;
  godsProductionMultiplier?: GameValue;
  isUpgraded?: boolean;
}

/**
 * Composes base cycle earn with power-up, renown, and god multipliers.
 */
export const getTotalEarnPerCycle = (
  factory: FactoryType,
  options: TotalEarnPerCycleOptions = {}
): GameValue => {
  const { amount, isUpgraded, productionValue } = getFactory(factory);
  const effectiveAmount = options.amount ?? amount;

  return getFactoryEarnPerCycle({
    amount: effectiveAmount > 0 ? effectiveAmount : 1,
    factoryDifficulty: getFactoryProgressDifficulty(),
    godsProductionMultiplier:
      options.godsProductionMultiplier ?? getGodsProductionMultiplier(),
    isUpgraded: options.isUpgraded ?? isUpgraded,
    productionValue,
  })
    .times(getPowerUpIncomeMultiplierForEarn())
    .times(getMissionRenownProductionMultiplier());
};
