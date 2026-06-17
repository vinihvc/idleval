import {
  FACTORY_DATA,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import type { GodId } from "@/content/gods";
import { POWER_UP_EFFECTS, type PowerUpTier } from "@/content/power-ups";
import { getScaledFactoryConfig } from "@/game/balance";
import { getGameDifficulty } from "@/game/difficulty";
import {
  getFactoryEarnPerCycle,
  getFactoryGoldPerSecond,
} from "@/game/factories";
import {
  getTotalProductionMultiplier,
  getTotalProductionSpeedMultiplier,
} from "@/game/gods";
import { getRenownProductionMultiplier } from "@/game/missions";
import type { FactoryPersistedState } from "@/game/types";
import { D, type GameValue } from "@/utils/decimal";

export interface RealmEconomyInput {
  factories: Record<FactoryType, FactoryPersistedState>;
  /** Factory progress difficulty for income and cost scaling. */
  factoryDifficulty?: number;
  godsInvoked: GodId[];
  /** Cumulative god production speed multiplier. */
  godsSpeedMultiplier?: number;
  /** Permanent production bonus from mission renown (percent). */
  renownPercent?: number;
}

const sumGoldPerSecond = (
  factories: Record<FactoryType, FactoryPersistedState>,
  godsMultiplier: GameValue,
  filter: (state: FactoryPersistedState) => boolean,
  economyOptions: {
    factoryDifficulty: number;
    godsSpeedMultiplier: number;
  }
): GameValue => {
  let total = D(0);

  for (const factory of FACTORY_TYPES) {
    const state = factories[factory];

    if (!filter(state)) {
      continue;
    }

    total = total.plus(
      getFactoryGoldPerSecond(factory, state, godsMultiplier, economyOptions)
    );
  }

  return total;
};

/**
 * Returns the realm's passive gold per second from automated production,
 * falling back to unlocked factories and then the starter grain rate.
 *
 * @example
 * getRealmGoldPerSecond({ factories, godsInvoked: [] }).toNumber() // > 0 at game start
 */
export const getRealmGoldPerSecond = (input: RealmEconomyInput): GameValue => {
  const godsMultiplier = getTotalProductionMultiplier(input.godsInvoked);
  const factoryDifficulty = input.factoryDifficulty ?? getGameDifficulty();
  const godsSpeedMultiplier =
    input.godsSpeedMultiplier ??
    getTotalProductionSpeedMultiplier(input.godsInvoked);
  const economyOptions = { factoryDifficulty, godsSpeedMultiplier };
  const renownMultiplier = getRenownProductionMultiplier(
    input.renownPercent ?? 0
  );

  const applyRenown = (rate: GameValue): GameValue =>
    rate.times(renownMultiplier);

  const automatedRate = sumGoldPerSecond(
    input.factories,
    godsMultiplier,
    (state) => state.isUnlocked && state.isAutomated && state.amount > 0,
    economyOptions
  );

  if (automatedRate.gt(0)) {
    return applyRenown(automatedRate);
  }

  const unlockedRate = sumGoldPerSecond(
    input.factories,
    godsMultiplier,
    (state) => state.isUnlocked && state.amount > 0,
    economyOptions
  );

  if (unlockedRate.gt(0)) {
    return applyRenown(unlockedRate);
  }

  const grainConfig = getScaledFactoryConfig("grain");
  const effectiveProductionTime = Math.max(
    1,
    Math.round(grainConfig.productionTime / godsSpeedMultiplier)
  );

  return applyRenown(
    getFactoryEarnPerCycle({
      amount: 1,
      factoryDifficulty,
      godsProductionMultiplier: D(1),
      isUpgraded: false,
      productionValue: FACTORY_DATA.grain.productionValue,
    }).div(effectiveProductionTime)
  );
};

/**
 * Rolls a fair gold grant for Mimir Coin based on realm production and tier.
 *
 * @example
 * rollMimirCoinGold("common", input, () => 0).gte(getRealmGoldPerSecond(input).times(45))
 */
export const rollMimirCoinGold = (
  tier: PowerUpTier,
  input: RealmEconomyInput,
  random = Math.random
): GameValue => {
  const { min, max } = POWER_UP_EFFECTS.mimirCoin.rollSecondsByTier[tier];
  const seconds = min + random() * (max - min);

  return getRealmGoldPerSecond(input).times(seconds).floor();
};
