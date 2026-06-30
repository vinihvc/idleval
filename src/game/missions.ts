// biome-ignore-all lint/performance/noBarrelFile: Re-exports keep @/game/missions import path stable after module split.

export {
  getMissionGoldRewardLevelMultiplier,
  getMissionObjectiveLevelMultiplier,
  getMissionPowerUpRewardCount,
} from "./missions/level-scaling";
export {
  buildMissionSlotPresentation,
  type MissionSlotPresentation,
} from "./missions/presentation";
export {
  getMissionProgress,
  getPlayerProgressStage,
  isMissionReadyToClaim,
  meetsMissionRequirements,
  type PlayerProgressStage,
  resetMissionsOnGodInvoke,
} from "./missions/progress";
export {
  type AppliedMissionRewards,
  getRenownProductionMultiplier,
  summarizeMissionRewards,
} from "./missions/rewards";
export {
  getScaledMissionObjective,
  getScaledMissionRewards,
  scaleMissionCountTarget,
  scaleMissionGoldTarget,
} from "./missions/scaling";
export {
  canClaimMission,
  captureMissionBaselines,
  findNewlyReadyMissionIds,
  getHasClaimableMission,
  getMissionSlotStatus,
  getVisibleMissionSlots,
  isMissionReplay,
  replaceActiveSlotAfterClaim,
  resolveActiveSlotIds,
  resolveMissionSlotStatus,
} from "./missions/slots";
export { getPlayerLevel, getPlayerLevelProgress } from "./player-level";
