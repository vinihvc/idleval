/** 1 = normal. >1 easier (more income, lower costs). <1 harder. */
export const GAME_BALANCE = 1.5;

/** Tuned baseline at GAME_BALANCE = 1 — not a difficulty knob. */
export const BALANCE_BASELINE = {
  productionValue: 2.85,
  productionTime: 0.75,
  baseBuyCost: 0.3,
  unlockPrice: 0.5,
  unitCostGrowth: 1.024,
  managerCostFactor: 187,
  upgradeCostFactor: 850,
  upgradeProductionMultiplier: 2,
  godGoldRequired: 0.6,
  missionGoldReward: 1.2,
  powerUpIncomeMultiplier: 2.4,
  powerUpTimeMultiplier: 0.55,
} as const;
