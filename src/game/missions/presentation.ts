import type { MissionDefinition } from "@/content/missions";
import { getScaledMissionObjective, getScaledMissionRewards } from "./scaling";

export interface MissionSlotPresentation {
  scaledObjective: MissionDefinition["objective"];
  scaledRewards: MissionDefinition["rewards"];
}

/**
 * Builds scaled mission objective and rewards for UI at a given player level.
 */
export const buildMissionSlotPresentation = (
  mission: MissionDefinition,
  playerLevel: number
): MissionSlotPresentation => ({
  scaledObjective: getScaledMissionObjective(mission.objective, playerLevel),
  scaledRewards: getScaledMissionRewards(mission.rewards, playerLevel),
});
