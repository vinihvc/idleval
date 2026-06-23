import type { MissionObjective } from "@/content/missions";
import type { MissionProgress } from "@/game/types";
import { m } from "@/i18n/messages";
import { D, type GameValue } from "@/utils/decimal";
import { amountFormatter } from "@/utils/formatters";

const GOLD_VALUE_RANGE = [D(1), D(1e3), D(1e6), D(1e9), D(1e12)] as const;

const getGoldDisplayUnit = (amount: GameValue): GameValue => {
  let rangeValue = D(1);

  for (let index = GOLD_VALUE_RANGE.length - 1; index >= 0; index--) {
    const candidate = GOLD_VALUE_RANGE[index];

    if (amount.gte(candidate)) {
      rangeValue = candidate;
      break;
    }
  }

  return rangeValue.div(100);
};

const quantizeGoldCurrent = (value: number, target: number): GameValue => {
  const unit = getGoldDisplayUnit(D(target));

  return D(value).div(unit).floor().times(unit);
};

const quantizeGoldTarget = (target: number): GameValue => {
  const unit = getGoldDisplayUnit(D(target));

  return D(target).div(unit).ceil().times(unit);
};

const isGoldObjective = (type: MissionObjective["type"]): boolean =>
  type === "earnGold" || type === "spendGold" || type === "holdGold";

const isBinaryObjective = (type: MissionObjective["type"]): boolean =>
  type === "unlockFactory" ||
  type === "upgradeFactory" ||
  type === "automateFactory" ||
  type === "invokeGod";

const formatProgressCurrent = (
  value: number,
  target: number,
  isGold: boolean
): string =>
  isGold
    ? amountFormatter(quantizeGoldCurrent(value, target))
    : String(Math.floor(value));

const formatProgressTarget = (value: number, isGold: boolean): string =>
  isGold
    ? amountFormatter(quantizeGoldTarget(value))
    : String(Math.ceil(value));

export const getMissionProgressBarPercent = (ratio: number): number =>
  ratio >= 1 ? 100 : Math.floor(ratio * 100);

export const formatMissionProgressLabel = (
  objective: MissionObjective,
  progress: MissionProgress
): string => {
  if (isBinaryObjective(objective.type)) {
    return m["ui.missions.progressPercent"]({
      percent: String(getMissionProgressBarPercent(progress.ratio)),
    });
  }

  const isGold = isGoldObjective(objective.type);

  return m["ui.missions.progress"]({
    current: formatProgressCurrent(progress.current, progress.target, isGold),
    target: formatProgressTarget(progress.target, isGold),
  });
};
