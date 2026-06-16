import { describe, expect, it } from "vitest";
import { MISSION_CATALOG } from "@/content/missions";
import {
  getLocalizedMissionObjective,
  getLocalizedMissionTitle,
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
    const firstMission = MISSION_CATALOG[0]!;

    expect(getLocalizedMissionObjective(firstMission.objective)).toBe(
      "Buy 1 Grain"
    );

    const secondMission = MISSION_CATALOG[1]!;

    expect(getLocalizedMissionObjective(secondMission.objective)).toBe(
      "Earn 500 gold"
    );
  });
});
