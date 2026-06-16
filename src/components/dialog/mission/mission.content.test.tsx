import { beforeEach, describe, expect, test, vi } from "vitest";
import { MissionClaimContent } from "@/components/dialog/mission/mission.content";
import { formatMissionProgressLabel } from "@/components/game/missions/format-mission-progress";
import type { MissionId } from "@/content/missions";
import { getMissionById } from "@/content/missions";
import { getLocalizedPowerUp } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";
import { D } from "@/utils/decimal";
import { amountFormatterWithDolarSign } from "@/utils/formatters";

vi.mock("@/providers/sound", () => ({
  sound: { play: vi.fn() },
}));

const requireMission = (id: "mission-001" | "mission-003" | "mission-005") => {
  const mission = getMissionById(id);

  if (!mission) {
    throw new Error(`Expected ${id} to exist in catalog`);
  }

  return mission;
};

const mission001 = requireMission("mission-001");
const mission003 = requireMission("mission-003");
const mission005 = requireMission("mission-005");

describe("MissionClaimContent", () => {
  beforeEach(() => {
    resetGame();
  });

  test("hides progress bar when mission is ready", async () => {
    await renderWithProviders(
      <MissionClaimContent
        missionId="mission-001"
        progress={{ current: 1, target: 1, ratio: 1 }}
        status="ready"
      />
    );

    expect(document.querySelector('[role="progressbar"]')).toBeNull();
  });

  test("shows progress bar when mission is in progress", async () => {
    const progress = { current: 0, target: 1, ratio: 0.4 };
    const progressLabel = formatMissionProgressLabel(
      mission001.objective,
      progress
    );

    await renderWithProviders(
      <MissionClaimContent
        missionId="mission-001"
        progress={progress}
        status="in_progress"
      />
    );

    const progressBar = document.querySelector('[data-slot="progress"]');

    expect(progressBar).not.toBeNull();
    expect(document.body.textContent).toContain(progressLabel);
    expect(document.querySelector('[role="button"]')).toBeNull();
  });

  test("renders gold rewards for mission-001", async () => {
    const goldReward = mission001.rewards.find(
      (reward) => reward.type === "gold"
    );

    const screen = await renderWithProviders(
      <MissionClaimContent
        missionId="mission-001"
        progress={{ current: 0, target: 1, ratio: 0 }}
        status="in_progress"
      />
    );

    await expect
      .element(screen.getByText(m["ui.missions.rewards"]()))
      .toBeInTheDocument();

    expect(document.querySelectorAll("li").length).toBe(
      mission001.rewards.length
    );

    if (goldReward?.type === "gold") {
      expect(document.body.textContent).toContain(
        amountFormatterWithDolarSign(D(goldReward.amount))
      );
    }
  });

  test("renders power-up reward for mission-003", async () => {
    const powerUp = getLocalizedPowerUp("mimirCoin");

    const screen = await renderWithProviders(
      <MissionClaimContent
        missionId="mission-003"
        progress={{ current: 2, target: 5, ratio: 0.4 }}
        status="in_progress"
      />
    );

    const visibleNames = screen
      .getByText(powerUp.name, { exact: true })
      .elements()
      .filter((element) => !element.closest(".sr-only"));

    expect(visibleNames.length).toBeGreaterThan(0);
    expect(mission003.rewards.some((reward) => reward.type === "powerUp")).toBe(
      true
    );
  });

  test("renders renown reward for mission-005", async () => {
    const renownReward = mission005.rewards.find(
      (reward) => reward.type === "renown"
    );

    const screen = await renderWithProviders(
      <MissionClaimContent
        missionId="mission-005"
        progress={{ current: 1000, target: 2000, ratio: 0.5 }}
        status="in_progress"
      />
    );

    if (renownReward?.type === "renown") {
      await expect
        .element(
          screen.getByText(
            m["ui.missions.reward.renown"]({
              percent: String(renownReward.percent),
            })
          )
        )
        .toBeInTheDocument();
    }
  });


  test("returns null for unknown mission id", async () => {
    await renderWithProviders(
      <MissionClaimContent
        missionId={"mission-unknown" as MissionId}
        progress={{ current: 0, target: 1, ratio: 0 }}
        status="in_progress"
      />
    );

    expect(
      document.querySelector('[data-slot="mission-claim-content"]')
    ).toBeNull();
  });
});
