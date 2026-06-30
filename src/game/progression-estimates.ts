import { PROGRESS_EASE } from "@/config/progress-ease";
import {
  FACTORY_DATA,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import type { GodId } from "@/content/gods";
import { GOD_DATA } from "@/content/gods";
import {
  getScaledFactoryConfig,
  getScaledGodGoldRequired,
} from "@/game/balance";
import { managerCost, upgradeCost } from "@/game/economy";
import {
  getFactoryEarnPerCycle,
  getFactoryUnlockPrice,
} from "@/game/factories";
import {
  getGodGoldRequired,
  getTotalProductionMultiplier,
  getTotalProductionSpeedMultiplier,
} from "@/game/gods";
import { D } from "@/utils/decimal";

export interface FactoryReferenceMetrics {
  factory: FactoryType;
  goldPerSecondOneUnit: number;
  managerGold: number;
  productionTimeSec: number;
  unlockGold: number;
  upgradeGold: number;
  valuePerUnitPerCycle: number;
}

export interface GodInvokeThreshold {
  effectiveGold: string;
  godId: GodId;
  index: number;
  productionMultiplier: number;
  productionSpeedMultiplier: number;
}

export interface ProgressionMilestoneEstimate {
  id: string;
  label: string;
  minutesMax: number;
  minutesMin: number;
}

/** Active-play efficiency for manual production before automation. */
export const REFERENCE_MANUAL_EFFICIENCY = 0.85;

/**
 * Balance-adjusted factory metrics at a given factory difficulty.
 */
export const getFactoryReferenceMetrics = (
  factoryDifficulty: number = PROGRESS_EASE.factory.difficulty
): FactoryReferenceMetrics[] =>
  FACTORY_TYPES.map((factory) => {
    const raw = FACTORY_DATA[factory];
    const scaled = getScaledFactoryConfig(factory);
    const valuePerUnitPerCycle = getFactoryEarnPerCycle({
      amount: 1,
      factoryDifficulty,
      godsProductionMultiplier: D(1),
      isUpgraded: false,
      productionValue: raw.productionValue,
    }).toNumber();
    const unlockGold = raw.unlockPrice
      ? getFactoryUnlockPrice(raw.unlockPrice, factoryDifficulty).toNumber()
      : 0;
    const managerGold = managerCost(
      raw.baseBuyCost,
      0,
      factoryDifficulty
    ).toNumber();
    const upgradeGold = upgradeCost(
      raw.baseBuyCost,
      0,
      factoryDifficulty
    ).toNumber();
    const goldPerSecondOneUnit = valuePerUnitPerCycle / scaled.productionTime;

    return {
      factory,
      productionTimeSec: scaled.productionTime,
      valuePerUnitPerCycle,
      unlockGold,
      managerGold,
      upgradeGold,
      goldPerSecondOneUnit,
    };
  });

/**
 * Effective invoke thresholds for each god with progress ease applied.
 */
export const getGodInvokeThresholds = (): GodInvokeThreshold[] =>
  GOD_DATA.map((god, index) => ({
    godId: god.id,
    index,
    effectiveGold: getGodGoldRequired(index).toString(),
    productionMultiplier: god.productionMultiplier,
    productionSpeedMultiplier: god.productionSpeedMultiplier,
  }));

/**
 * Approximate minutes to reach a gold target at a constant income rate.
 */
export const estimateMinutesToTarget = (
  targetGold: number,
  incomePerSecond: number
): number => targetGold / Math.max(incomePerSecond, 1) / 60;

/**
 * Reference milestone pacing for docs/PROGRESSION.md (active play, no missions).
 */
export const estimateMilestoneMinutes = (): ProgressionMilestoneEstimate[] => {
  const earlyDifficulty = PROGRESS_EASE.factory.difficulty;
  const grain = getFactoryReferenceMetrics(earlyDifficulty)[0];
  const manualGrainRate =
    grain.goldPerSecondOneUnit * REFERENCE_MANUAL_EFFICIENCY;
  const wine = getFactoryReferenceMetrics(earlyDifficulty)[1];

  return [
    {
      id: "grain-manager",
      label: "Grain manager",
      minutesMin: estimateMinutesToTarget(grain.managerGold, manualGrainRate),
      minutesMax:
        estimateMinutesToTarget(grain.managerGold, manualGrainRate) * 1.4,
    },
    {
      id: "unlock-wine",
      label: "Unlock wine",
      minutesMin: estimateMinutesToTarget(wine.unlockGold, manualGrainRate * 2),
      minutesMax:
        estimateMinutesToTarget(wine.unlockGold, manualGrainRate * 1.5) * 1.3,
    },
    {
      id: "first-god",
      label: "First god (Huangdi)",
      minutesMin: 45,
      minutesMax: 90,
    },
    {
      id: "all-gods",
      label: "All six gods",
      minutesMin: 2880,
      minutesMax: 5760,
    },
  ];
};

/**
 * Cumulative god multipliers after invoking gods in order.
 */
export const getGodBonusAfterCount = (
  invokedCount: number
): {
  goldMultiplier: number;
  speedMultiplier: number;
} => {
  const invoked = GOD_DATA.slice(0, invokedCount).map((god) => god.id);

  return {
    goldMultiplier: getTotalProductionMultiplier(invoked).toNumber(),
    speedMultiplier: getTotalProductionSpeedMultiplier(invoked),
  };
};

/**
 * Balance-adjusted god threshold without progress ease invoke discount.
 */
export const getBalanceOnlyGodGold = (index: number): string =>
  D(getScaledGodGoldRequired(GOD_DATA[index].goldRequired)).toString();
