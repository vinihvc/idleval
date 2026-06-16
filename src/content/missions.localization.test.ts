import { assert, describe, expect, it } from "vitest";
import {
  getLocalizedMissionObjective,
  getLocalizedMissionTitle,
  getMissionById,
  MISSION_CATALOG,
} from "@/content/missions";

describe("mission localization", () => {
  it("resolves mission titles without undefined", () => {
    for (const mission of MISSION_CATALOG.slice(0, 3)) {
      const title = getLocalizedMissionTitle(mission.id);

      expect(title).toBeTruthy();
      expect(title).not.toContain("undefined");
    }
  });

  it("resolves mission objectives with interpolated params", () => {
    const firstMission = getMissionById("mission-001");
    assert(firstMission);

    expect(getLocalizedMissionObjective(firstMission.objective)).toBe(
      "Buy 1 Grain"
    );

    const secondMission = getMissionById("mission-002");
    assert(secondMission);

    expect(getLocalizedMissionObjective(secondMission.objective)).toBe(
      "Finish 8 production runs on this quest"
    );
  });
});
