import { describe, expect, it } from "vitest";
import { MISSION_CATALOG } from "@/content/missions";
import {
  assertMissionGateOrdering,
  findMissionProgressionIssues,
  simulateThroughMission,
} from "@/game/mission-progression";

describe("mission progression simulation", () => {
  it("keeps factory gates reachable in catalog order", () => {
    expect(assertMissionGateOrdering()).toEqual([]);
  });

  it("keeps gold targets within 1.5× estimated wallet capacity", () => {
    const issues = findMissionProgressionIssues().filter(
      (issue) => issue.kind === "gold_exceeds_capacity"
    );

    expect(issues).toEqual([]);
  });

  it("keeps factory unlock missions affordable at their order", () => {
    const issues = findMissionProgressionIssues().filter(
      (issue) => issue.kind === "unlock_unaffordable"
    );

    expect(issues).toEqual([]);
  });

  it("does not repeat late-game upgrade or automate factory objectives", () => {
    const lateUpgrades = MISSION_CATALOG.filter(
      (mission) =>
        mission.order >= 101 &&
        (mission.objective.type === "upgradeFactory" ||
          mission.objective.type === "automateFactory")
    );

    expect(lateUpgrades.map((mission) => mission.id)).toEqual([
      "mission-101",
      "mission-108",
      "mission-113",
      "mission-114",
    ]);
  });

  it("ends with reliquary capstone at 50 units", () => {
    const finalMission = MISSION_CATALOG.at(-1);
    expect(finalMission?.id).toBe("mission-200");
    expect(finalMission?.objective).toMatchObject({
      type: "ownUnits",
      factory: "reliquary",
      target: 50,
    });
  });

  it("simulates monotonic reliquary unit growth in endgame", () => {
    const reliquaryTargets = MISSION_CATALOG.flatMap((mission) => {
      const { objective } = mission;
      if (objective.type !== "ownUnits" || objective.factory !== "reliquary") {
        return [];
      }
      return [objective.target];
    });

    for (let index = 1; index < reliquaryTargets.length; index++) {
      expect(reliquaryTargets[index]).toBeGreaterThanOrEqual(
        reliquaryTargets[index - 1] ?? 0
      );
    }
  });

  it("reaches late-game income by mission 200", () => {
    const state = simulateThroughMission(200);
    expect(state.units.reliquary).toBeGreaterThanOrEqual(50);
    expect(state.unlocked.has("reliquary")).toBe(true);
  });
});
