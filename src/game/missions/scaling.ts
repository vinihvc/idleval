import { PROGRESS_EASE } from "@/config/progress-ease";
import type { MissionObjective, MissionReward } from "@/content/missions";
import { D } from "@/utils/decimal";

/**
 * Mission difficulty/reward multiplier by invoked god count: cycleBase^godsInvoked.
 *
 * @example
 * getMissionGodCycleMultiplier(0) // 1
 * getMissionGodCycleMultiplier(1) // 2
 * getMissionGodCycleMultiplier(2) // 4
 */
export const getMissionGodCycleMultiplier = (godsInvoked: number): number =>
  PROGRESS_EASE.mission.cycleBase ** godsInvoked;

/**
 * Scales a catalog gold target for the current god cycle.
 */
export const scaleMissionGoldTarget = (
  raw: string,
  multiplier: number
): string => D(raw).times(multiplier).round().toString();

/**
 * Scales a catalog count target for the current god cycle.
 */
export const scaleMissionCountTarget = (
  raw: number,
  multiplier: number
): number => Math.ceil(raw * multiplier);

/**
 * Returns catalog objective with scaled numeric targets for the current god cycle.
 */
export const getScaledMissionObjective = (
  objective: MissionObjective,
  godsInvoked: number
): MissionObjective => {
  const multiplier = getMissionGodCycleMultiplier(godsInvoked);

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
    case "claimDailyRewards":
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
 * Returns catalog rewards with scaled gold amounts for the current god cycle.
 * Pass rewards from `MISSION_CATALOG` only — not values already scaled.
 */
export const getScaledMissionRewards = (
  rewards: MissionReward[],
  godsInvoked: number
): MissionReward[] => {
  const multiplier = getMissionGodCycleMultiplier(godsInvoked);

  if (multiplier === 1) {
    return rewards;
  }

  return rewards.map((reward) => {
    if (reward.type !== "gold") {
      return reward;
    }

    return {
      ...reward,
      amount: scaleMissionGoldTarget(reward.amount, multiplier),
    };
  });
};
