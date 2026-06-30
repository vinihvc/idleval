import type { MissionId } from "@/content/missions";
import type { MissionsPersistedState } from "@/game/types";

/**
 * Whether a mission is active again after a prior claim (catalog loop replay).
 *
 * @example
 * isMissionReplay({ claimedIds: ["mission-001"], activeSlotIds: ["mission-001"], ... }, "mission-001") // true
 */
export const isMissionReplay = (
  state: MissionsPersistedState,
  missionId: MissionId
): boolean =>
  state.claimedIds.includes(missionId) &&
  state.activeSlotIds.includes(missionId);
