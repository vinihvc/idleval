import { hasMessageKey, translate, translateParams } from "@/i18n/localize";
import type { FactoryType } from "../factories";
import type { MissionId, MissionObjective } from "./types";

export const getLocalizedMissionTitle = (id: MissionId): string => {
  const key = `mission.${id}.title`;

  if (hasMessageKey(key)) {
    return translate(key);
  }

  return translate("mission.fallback.title");
};

const objectiveA11yKey = (
  type: MissionObjective["type"],
  scope: MissionObjective["scope"] | undefined
): string => {
  if (scope === "sinceActive") {
    const sinceActiveKey = `mission.objective.a11y.${type}.sinceActive`;

    if (hasMessageKey(sinceActiveKey)) {
      return sinceActiveKey;
    }
  }

  return `mission.objective.a11y.${type}`;
};

export const getLocalizedMissionObjective = (
  objective: MissionObjective
): string => {
  const key = objectiveA11yKey(
    objective.type,
    "scope" in objective ? objective.scope : undefined
  );

  if (!hasMessageKey(key)) {
    return translate("mission.fallback.objective");
  }

  return formatMissionObjectiveA11y(objective, key);
};

const formatMissionObjectiveA11y = (
  objective: MissionObjective,
  key = objectiveA11yKey(
    objective.type,
    "scope" in objective ? objective.scope : undefined
  )
): string => {
  const factoryName = (factory: FactoryType) =>
    translate(`factory.${factory}.name`);

  switch (objective.type) {
    case "earnGold":
    case "spendGold":
      return translateParams(key, {
        amount: objective.target,
      });
    case "holdGold":
      return translateParams(key, {
        amount: objective.target,
      });
    case "ownUnits":
      return translateParams("mission.objective.a11y.ownUnits", {
        amount: String(objective.target),
        factory: factoryName(objective.factory),
      });
    case "unlockFactory":
    case "upgradeFactory":
    case "automateFactory":
      return translateParams(`mission.objective.a11y.${objective.type}`, {
        factory: factoryName(objective.factory),
      });
    case "invokeGod":
      return translateParams("mission.objective.a11y.invokeGod", {
        god: translate(`god.${objective.godId}.name`),
      });
    case "completeCycles":
    case "activatePowerUps":
      return translateParams(key, {
        amount: String(objective.target),
      });
    default: {
      const exhaustiveCheck: never = objective;
      return exhaustiveCheck;
    }
  }
};
