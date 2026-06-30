import {
  getLocalizedMissionObjective,
  getMissionById,
  type MissionDefinition,
} from "@/content/missions";
import { buildMissionSlotPresentation } from "@/game/missions";
import type { MissionProgress, MissionSlotView } from "@/game/types";
import { m } from "@/i18n/messages";
import { usePlayerLevel } from "@/store/atoms/missions.selectors";
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
  const playerLevel = usePlayerLevel();
  const { id: missionId, status, order, progress } = slot;
  const missionDefinition = getMissionById(missionId);
  const presentation = missionDefinition
    ? buildMissionSlotPresentation(missionDefinition, playerLevel)
    : undefined;
  const scaledObjective = presentation?.scaledObjective;
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
