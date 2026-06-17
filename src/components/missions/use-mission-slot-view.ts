import {
  getLocalizedMissionObjective,
  getMissionById,
  type MissionDefinition,
} from "@/content/missions";
import { getScaledMissionObjective } from "@/game/missions";
import type { MissionProgress, MissionSlotView } from "@/game/types";
import { m } from "@/i18n/messages";
import { useGods } from "@/store/atoms/gods";
import { formatMissionProgressLabel } from "./format-mission-progress";

export interface MissionSlotViewModel {
  missionId: MissionSlotView["id"];
  objectiveLabel: string;
  order: MissionSlotView["order"];
  progress: MissionProgress;
  progressLabel: string;
  scaledObjective: MissionDefinition["objective"] | undefined;
  status: MissionSlotView["status"];
}

export const useMissionSlotView = (
  slot: MissionSlotView
): MissionSlotViewModel => {
  const { count: godsInvoked } = useGods();
  const { id: missionId, status, order, progress } = slot;
  const missionDefinition = getMissionById(missionId);
  const objective = missionDefinition?.objective;
  const scaledObjective = objective
    ? getScaledMissionObjective(objective, godsInvoked)
    : undefined;
  const objectiveLabel = scaledObjective
    ? getLocalizedMissionObjective(scaledObjective)
    : missionId;
  const progressLabel = scaledObjective
    ? formatMissionProgressLabel(scaledObjective, progress)
    : m["ui.missions.progress"]({
        current: String(progress.current),
        target: String(progress.target),
      });

  return {
    missionId,
    status,
    order,
    progress,
    scaledObjective,
    objectiveLabel,
    progressLabel,
  };
};
