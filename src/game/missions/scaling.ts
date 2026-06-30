import type { MissionObjective, MissionReward } from "@/content/missions";
import {
  getMissionGoldRewardLevelMultiplier,
  getMissionObjectiveLevelMultiplier,
  getMissionPowerUpRewardCount,
} from "@/game/missions/level-scaling";
import { D } from "@/utils/decimal";

/**
 * Scales a catalog gold target for the current player level.
 */
export const scaleMissionGoldTarget = (
  raw: string,
  multiplier: number
): string => D(raw).times(multiplier).round().toString();

/**
 * Scales a catalog count target for the current player level.
 */
export const scaleMissionCountTarget = (
  raw: number,
  multiplier: number
): number => Math.ceil(raw * multiplier);

/**
 * Returns catalog objective with scaled numeric targets for the current player level.
 */
export const getScaledMissionObjective = (
  objective: MissionObjective,
  playerLevel: number
): MissionObjective => {
  const multiplier = getMissionObjectiveLevelMultiplier(playerLevel);

  if (multiplier === 1) {
    return objective;
  }

  switch (objective.type) {
    case "earnGold":
    case "spendGold":
    case "holdGold":
      return {
        ...objective,
        target: scaleMissionGoldTarget(objective.target, multiplier),
      };
    case "ownUnits":
      return {
        ...objective,
        target: scaleMissionCountTarget(objective.target, multiplier),
      };
    case "completeCycles":
    case "activatePowerUps":
      return {
        ...objective,
        target: scaleMissionCountTarget(objective.target, multiplier),
      };
    case "unlockFactory":
    case "upgradeFactory":
    case "automateFactory":
    case "invokeGod":
      return objective;
    default: {
      const exhaustiveCheck: never = objective;
      return exhaustiveCheck;
    }
  }
};

/**
 * Returns catalog rewards scaled for the current player level.
 * Pass rewards from `MISSION_CATALOG` only — not values already scaled.
 */
export const getScaledMissionRewards = (
  rewards: MissionReward[],
  playerLevel: number
): MissionReward[] => {
  const goldMultiplier = getMissionGoldRewardLevelMultiplier(playerLevel);

  return rewards.map((reward) => {
    if (reward.type === "gold") {
      return {
        ...reward,
        amount: scaleMissionGoldTarget(reward.amount, goldMultiplier),
      };
    }

    if (reward.type === "powerUp") {
      return {
        ...reward,
        count: getMissionPowerUpRewardCount(reward.count ?? 1, playerLevel),
      };
    }

    return reward;
  });
};
