import { beforeEach, describe, expect, test, vi } from "vitest";
import MissionDialog from "@/components/dialog/mission/mission";
import { getLocalizedMissionTitle, getMissionById } from "@/content/missions";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { missionsAtom } from "@/store/atoms/missions.atom";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

const mission001 = getMissionById("mission-001");

if (!mission001) {
  throw new Error("Expected mission-001 to exist in catalog");
}

describe("MissionDialog", () => {
  beforeEach(() => {
    resetGame();
  });

  test("renders mission title and claim content when open", async () => {
    const screen = await renderWithProviders(
      <MissionDialog
        mission={mission001}
        onOpenChange={vi.fn()}
        open
        progress={{ current: 0, target: 1, ratio: 0.5 }}
        status="in_progress"
      />
    );

    await expect
      .element(
        screen.getByRole("heading", {
          name: getLocalizedMissionTitle("mission-001"),
        })
      )
      .toBeInTheDocument();

    await expect
      .poll(() => document.querySelector('[data-slot="mission-claim-content"]'))
      .not.toBeNull();

    await expect
      .element(screen.getByText(m["ui.missions.rewards"]()))
      .toBeInTheDocument();
  });

  test("renders hero image as decorative", async () => {
    await renderWithProviders(
      <MissionDialog
        mission={mission001}
        onOpenChange={vi.fn()}
        open
        progress={{ current: 0, target: 1, ratio: 0 }}
        status="in_progress"
      />
    );

    const hero = document.querySelector('img[src="/images/characters/heracles.webp"]');

    expect(hero?.getAttribute("aria-hidden")).toBe("true");
    expect(hero?.getAttribute("alt")).toBe(m["ui.missions.imageAlt"]());
  });

  test("shows claim button in footer when mission is ready", async () => {
    const screen = await renderWithProviders(
      <MissionDialog
        mission={mission001}
        onOpenChange={vi.fn()}
        open
        progress={{ current: 1, target: 1, ratio: 1 }}
        status="ready"
      />
    );

    await expect
      .element(screen.getByRole("button", { name: m["ui.missions.claim"]() }))
      .toBeInTheDocument();
  });

  test("announces claim and calls onOpenChange when claim succeeds", async () => {
    store.set(missionsAtom, (previous) => ({
      ...previous,
      readyToClaimIds: ["mission-001"],
    }));

    const onOpenChange = vi.fn();

    const screen = await renderWithProviders(
      <MissionDialog
        mission={mission001}
        onOpenChange={onOpenChange}
        open
        progress={{ current: 1, target: 1, ratio: 1 }}
        status="ready"
      />
    );

    await screen
      .getByRole("button", { name: m["ui.missions.claim"]() })
      .click();

    await expect
      .poll(() => document.querySelector('[role="status"]')?.textContent)
      .toBe(m["ui.a11y.missionClaimed"]());

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
