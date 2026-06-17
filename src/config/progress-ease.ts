export const PROGRESS_EASE = {
  factoryProgressWeights: {
    factoryUnlocked: 1,
    factoryUpgraded: 1,
    factoryAutomated: 1,
  },
  factory: {
    startDifficulty: 1.25,
    endDifficulty: 1,
    decayByProgressRatio: 0.45,
  },
  god: {
    firstGodDifficulty: 1.15,
    minDifficulty: 0.7,
  },
  mission: {
    cycleBase: 2,
  },
} as const;
