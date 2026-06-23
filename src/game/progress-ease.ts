import { PROGRESS_EASE } from "@/config/progress-ease";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { GOD_COUNT } from "@/content/gods";
import { getGameDifficulty } from "@/game/difficulty";
import type { FactoriesPersistedState } from "@/game/types";

export interface FactoryProgressInput {
  factories: FactoriesPersistedState;
  godsInvokedCount: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const lerp = (start: number, end: number, t: number): number =>
  start + (end - start) * t;

const getFactoryState = (
  factories: FactoriesPersistedState,
  factory: FactoryType
) => factories[factory];

/**
 * Progress score from factory milestones (unlock, upgrade, automate).
 *
 * @example
 * computeFactoryProgressScore({ factories: {}, godsInvokedCount: 0 }) // 0
 */
export const computeFactoryProgressScore = (
  input: FactoryProgressInput
): number => {
  const { factoryProgressWeights } = PROGRESS_EASE;
  let score = 0;

  for (const factory of FACTORY_TYPES) {
    const state = getFactoryState(input.factories, factory);

    if (!state) {
      continue;
    }

    if (state.isUnlocked) {
      score += factoryProgressWeights.factoryUnlocked;
    }

    if (state.isUpgraded) {
      score += factoryProgressWeights.factoryUpgraded;
    }

    if (state.isAutomated) {
      score += factoryProgressWeights.factoryAutomated;
    }
  }

  return score;
};

/**
 * Maximum factory progress score when every tier is unlocked, upgraded, and automated.
 *
 * @example
 * getMaxFactoryProgressScore() // 18
 */
export const getMaxFactoryProgressScore = (): number => {
  const { factoryProgressWeights } = PROGRESS_EASE;

  return (
    FACTORY_TYPES.length *
    (factoryProgressWeights.factoryUnlocked +
      factoryProgressWeights.factoryUpgraded +
      factoryProgressWeights.factoryAutomated)
  );
};

/**
 * Factory progress normalized to 0..1.
 */
export const getNormalizedFactoryProgress = (score: number): number => {
  const maxScore = getMaxFactoryProgressScore();

  if (maxScore <= 0) {
    return 0;
  }

  return clamp(score / maxScore, 0, 1);
};

/**
 * Early-game factory ease: boosted until the first god is invoked.
 *
 * @example
 * getFactoryProgressDifficulty({ factories: {}, godsInvokedCount: 0 }) // 1.3
 * getFactoryProgressDifficulty({ factories: {}, godsInvokedCount: 1 }) // 1
 */
export const getFactoryProgressDifficulty = (
  input?: FactoryProgressInput
): number => {
  if (!input) {
    return getGameDifficulty();
  }

  if (input.godsInvokedCount >= 1) {
    return PROGRESS_EASE.factory.endDifficulty;
  }

  const score = computeFactoryProgressScore(input);
  const progress = getNormalizedFactoryProgress(score);
  const { startDifficulty, endDifficulty, decayByProgressRatio } =
    PROGRESS_EASE.factory;
  const decay = clamp(progress / decayByProgressRatio, 0, 1);

  return lerp(startDifficulty, endDifficulty, decay);
};

/**
 * Invoke cost difficulty by god index: first god easier, later gods harder (log₂).
 *
 * @example
 * getGodInvokeDifficulty(0) // 1.15
 * getGodInvokeDifficulty(5) // 0.7
 */
export const getGodInvokeDifficulty = (godIndex: number): number => {
  const { firstGodDifficulty, minDifficulty } = PROGRESS_EASE.god;

  if (godIndex <= 0) {
    return firstGodDifficulty;
  }

  const maxIndex = GOD_COUNT - 1;
  const logFactor = Math.log2(1 + godIndex) / Math.log2(1 + maxIndex);

  return firstGodDifficulty - logFactor * (firstGodDifficulty - minDifficulty);
};
