import { describe, expect, it } from "vitest";
import {
  getLocalizedMissionObjective,
  getLocalizedMissionTitle,
  MISSION_CATALOG,
} from "@/content/missions";
import type { MissionObjective } from "@/content/missions/types";

const sampleObjectives: MissionObjective[] = [
  { type: "earnGold", target: "1000", scope: "lifetime" },
  { type: "spendGold", target: "500", scope: "run" },
  { type: "holdGold", target: "2500", scope: "run" },
  {
    type: "ownUnits",
    factory: "grain",
    target: 3,
    scope: "lifetime",
  },
  {
    type: "unlockFactory",
    factory: "wine",
    scope: "run",
  },
  {
    type: "upgradeFactory",
    factory: "grain",
    scope: "run",
  },
  {
    type: "automateFactory",
    factory: "grain",
    scope: "run",
  },
  {
    type: "invokeGod",
    godId: "huangdi",
    scope: "lifetime",
  },
  { type: "completeCycles", target: 5, scope: "sinceActive" },
  { type: "claimDailyRewards", target: 2, scope: "sinceActive" },
  { type: "activatePowerUps", target: 1, scope: "sinceActive" },
];

describe("mission localization", () => {
  it("resolves mission titles without undefined", () => {
    for (const mission of MISSION_CATALOG.slice(0, 3)) {
      const title = getLocalizedMissionTitle(mission.id);

      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toContain("undefined");
    }
  });

  it.each(
    sampleObjectives.map((objective) => [objective.type, objective])
  )("resolves %s objective with a non-empty localized string", (_type, objective) => {
    const localized = getLocalizedMissionObjective(objective);

    expect(localized.length).toBeGreaterThan(0);
    expect(localized).not.toContain("undefined");
  });
});
