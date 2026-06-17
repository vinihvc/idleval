import type { MissionObjective } from "@/content/missions";
import type { MissionProgress } from "@/game/types";
import { m } from "@/i18n/messages";
import { D } from "@/utils/decimal";
import { amountFormatter } from "@/utils/formatters";

const isGoldObjective = (type: MissionObjective["type"]): boolean =>
  type === "earnGold" || type === "spendGold" || type === "holdGold";

const isBinaryObjective = (type: MissionObjective["type"]): boolean =>
  type === "unlockFactory" ||
  type === "upgradeFactory" ||
  type === "automateFactory" ||
  type === "invokeGod";

const formatProgressValue = (value: number, isGold: boolean): string =>
  isGold ? amountFormatter(D(value)) : String(Math.floor(value));

export const formatMissionProgressLabel = (
  objective: MissionObjective,
  progress: MissionProgress
): string => {
  if (isBinaryObjective(objective.type)) {
    return m["ui.missions.progressPercent"]({
      percent: String(Math.round(progress.ratio * 100)),
    });
  }

  const isGold = isGoldObjective(objective.type);

  return m["ui.missions.progress"]({
    current: formatProgressValue(progress.current, isGold),
    target: formatProgressValue(progress.target, isGold),
  });
};
