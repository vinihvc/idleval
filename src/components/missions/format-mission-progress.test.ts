import { describe, expect, it } from "vitest";
import type { MissionObjective } from "@/content/missions";
import type { MissionProgress } from "@/game/types";
import { formatMissionProgressLabel } from "./format-mission-progress";

const progress = (
  current: number,
  target: number,
  ratio = current / target
): MissionProgress => ({
  current,
  target,
  ratio,
});

describe("formatMissionProgressLabel", () => {
  it("formats gold objectives with abbreviated amounts", () => {
    const objective: MissionObjective = {
      type: "earnGold",
      target: "5000",
      scope: "lifetime",
    };

    expect(
      formatMissionProgressLabel(objective, progress(1500, 5000, 0.3))
    ).toBe("1.5 K / 5 K");
  });

  it("formats count objectives with integers", () => {
    const objective: MissionObjective = {
      type: "ownUnits",
      factory: "grain",
      target: 3,
      scope: "lifetime",
    };

    expect(formatMissionProgressLabel(objective, progress(1, 3, 1 / 3))).toBe(
      "1 / 3"
    );
  });

  it("formats binary objectives as percent", () => {
    const objective: MissionObjective = {
      type: "unlockFactory",
      factory: "grain",
      scope: "run",
    };

    expect(formatMissionProgressLabel(objective, progress(0, 1, 0))).toBe("0%");
    expect(formatMissionProgressLabel(objective, progress(1, 1, 1))).toBe(
      "100%"
    );
  });
});
