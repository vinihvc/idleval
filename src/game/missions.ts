// biome-ignore-all lint/performance/noBarrelFile: Re-exports keep @/game/missions import path stable after module split.

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
  getMissionGodCycleMultiplier,
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
  replaceActiveSlotAfterClaim,
  resolveActiveSlotIds,
} from "./missions/slots";
