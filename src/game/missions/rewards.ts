import { GAME_BALANCE } from "@/config/balance";
import type { MissionReward } from "@/content/missions";
import { D, type GameValue } from "@/utils/decimal";
import { getMissionGodCycleMultiplier } from "./scaling";

/**
 * Permanent production multiplier from stacked renown rewards.
 */
export const getRenownProductionMultiplier = (
  renownPercent: number
): GameValue => D(1).plus(D(renownPercent).div(100));

export interface AppliedMissionRewards {
  gold: GameValue;
  powerUps: Array<MissionReward & { type: "powerUp" }>;
  renownPercent: number;
}

/**
 * Aggregates catalog mission rewards for the store layer to apply.
 *
 * Applies `GAME_BALANCE.missionGoldReward` and the god-cycle multiplier
 * (`2^godsInvoked`). Pass rewards from `MISSION_CATALOG` only — not values
 * already scaled by `getScaledMissionRewards`, or gold will be doubled.
 *
 * @example
 * summarizeMissionRewards(mission.rewards, snapshot.gods.invoked.length)
 */
export const summarizeMissionRewards = (
  rewards: MissionReward[],
  godsInvoked = 0
): AppliedMissionRewards => {
  let gold = D(0);
  let renownPercent = 0;
  const powerUps: Array<MissionReward & { type: "powerUp" }> = [];
  const cycleMultiplier = getMissionGodCycleMultiplier(godsInvoked);

  for (const reward of rewards) {
    switch (reward.type) {
      case "gold":
        gold = gold.plus(
          D(reward.amount)
            .times(GAME_BALANCE.missionGoldReward)
            .times(cycleMultiplier)
        );
        break;
      case "renown":
        renownPercent += reward.percent;
        break;
      case "powerUp":
        powerUps.push(reward);
        break;
      default: {
        const exhaustiveCheck: never = reward;
        return exhaustiveCheck;
      }
    }
  }

  return { gold, renownPercent, powerUps };
};
