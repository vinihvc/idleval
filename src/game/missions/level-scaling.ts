import { PLAYER_LEVEL } from "@/config/player-level";

const clampPlayerLevel = (level: number): number =>
  Math.min(
    PLAYER_LEVEL.maxLevel,
    Math.max(PLAYER_LEVEL.minLevel, Math.round(level))
  );

/**
 * Mission objective difficulty multiplier for a player level.
 *
 * @example
 * getMissionObjectiveLevelMultiplier(1) // 1
 * getMissionObjectiveLevelMultiplier(50) // ~1.81
 */
export const getMissionObjectiveLevelMultiplier = (level: number): number =>
  PLAYER_LEVEL.missionObjectiveBase ** (clampPlayerLevel(level) - 1);

/**
 * Mission gold reward multiplier for a player level (more generous than objectives).
 *
 * @example
 * getMissionGoldRewardLevelMultiplier(1) // 1
 * getMissionGoldRewardLevelMultiplier(50) // ~5.58
 */
export const getMissionGoldRewardLevelMultiplier = (level: number): number =>
  PLAYER_LEVEL.missionGoldBase ** (clampPlayerLevel(level) - 1);

/**
 * Total power-up count after level-based bonus.
 *
 * @example
 * getMissionPowerUpRewardCount(1, 40) // 3
 */
export const getMissionPowerUpRewardCount = (
  baseCount: number,
  level: number
): number => {
  const bonus = Math.floor(
    clampPlayerLevel(level) / PLAYER_LEVEL.powerUpBonusEveryLevels
  );

  return Math.max(1, baseCount + bonus);
};
