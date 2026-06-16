import { describe, expect, test } from "vitest";
import { formatMissionProgressLabel } from "@/components/game/missions/format-mission-progress";
import {
  getLocalizedMissionObjective,
  getMissionById,
} from "@/content/missions";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { missionsAtom } from "@/store/atoms/missions";
import { statisticsAtom } from "@/store/atoms/statistics";
import { renderWithProviders } from "@/test/render-with-providers";
import { Missions } from "./missions";

const missionId = "mission-001";
const mission = getMissionById(missionId);

if (!mission) {
  throw new Error("Expected mission-001 to exist in catalog");
}

const objectiveLabel = getLocalizedMissionObjective(mission.objective);

const getFirstSlotButton = () =>
  document.querySelector(
    '[data-slot="mission-slot"]'
  ) as HTMLButtonElement | null;

describe("MissionSlots", () => {
  test("renders three mission slot buttons", async () => {
    await renderWithProviders(<Missions />);

    await expect
      .poll(
        () => document.querySelectorAll('[data-slot="mission-slot"]').length
      )
      .toBe(3);
  });

  test("marks a completed mission slot as ready", async () => {
    store.set(statisticsAtom, (previous) => ({
      ...previous,
      factories: {
        ...previous.factories,
        grain: {
          ...previous.factories.grain,
          quantity: 1,
        },
      },
    }));

    store.set(missionsAtom, (previous) => ({
      ...previous,
      readyToClaimIds: ["mission-001"],
    }));

    const screen = await renderWithProviders(<Missions />);

    await expect
      .poll(() =>
        document.querySelector(
          '[data-slot="mission-slot"][data-status="ready"]'
        )
      )
      .not.toBeNull();

    const button = screen.getByRole("button", {
      name: m["ui.missions.slot.claimable"]({
        order: "1",
        title: objectiveLabel,
      }),
    });

    await expect.element(button).toHaveAttribute("data-status", "ready");
  });

  test("includes progress in in-progress aria label", async () => {
    const progress = { current: 0, target: 1, ratio: 0.5 };
    const progressLabel = formatMissionProgressLabel(
      mission.objective,
      progress
    );

    const screen = await renderWithProviders(<Missions />);

    await expect.poll(() => getFirstSlotButton()).not.toBeNull();

    await expect
      .element(
        screen.getByRole("button", {
          name: m["ui.missions.slot.inProgress"]({
            order: "1",
            title: objectiveLabel,
            progress: progressLabel,
          }),
        })
      )
      .toHaveAttribute("data-status", "in_progress");
  });

  test("sets progress value from slot ratio", async () => {
    await renderWithProviders(<Missions />);

    await expect.poll(() => getFirstSlotButton()).not.toBeNull();

    const progress = document.querySelector('[role="progressbar"]');

    expect(progress?.getAttribute("aria-valuenow")).toBe("0");
  });

  test("opens mission dialog when a slot is clicked", async () => {
    await renderWithProviders(<Missions />);

    await expect.poll(() => getFirstSlotButton()).not.toBeNull();

    getFirstSlotButton()?.click();

    await expect
      .poll(() => document.querySelector('[data-slot="mission-claim-content"]'))
      .not.toBeNull();
  });
});
