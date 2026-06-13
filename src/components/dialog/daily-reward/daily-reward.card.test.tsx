import { beforeEach, describe, expect, test } from "vitest";
import { DailyRewardCard } from "@/components/dialog/daily-reward/daily-reward.card";
import { getLocalizedPowerUp, type PowerUpId } from "@/content/power-ups";
import { getLocalDateString } from "@/game/power-ups";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { initialInventoryState, inventoryAtom } from "@/store/atoms/inventory";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

const getFigureName = (
  day: number,
  powerUpId: PowerUpId,
  status: "claimed" | "current" | "locked" | "next"
) => {
  const lore = getLocalizedPowerUp(powerUpId);
  const dayLabel = String(day).padStart(2, "0");
  let statusLabel = m["ui.daily.status.next"](String(day));

  if (status === "claimed") {
    statusLabel = m["ui.daily.status.claimed"](String(day));
  } else if (status === "current") {
    statusLabel = m["ui.daily.status.today"](String(day));
  } else if (status === "locked") {
    statusLabel = m["ui.daily.status.locked"](String(day));
  }

  return m["ui.daily.dayReward"]({
    day: dayLabel,
    name: lore.name,
    status: statusLabel,
  });
};

describe("DailyRewardCard", () => {
  beforeEach(() => {
    resetGame();
  });

  const setDailyRewardState = (options: {
    dailyStreak: number;
    lastClaimLocalDate: string | null;
  }) => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      dailyStreak: options.dailyStreak,
      lastClaimLocalDate: options.lastClaimLocalDate,
    });
  };

  test("renders day metadata and claimed status label", async () => {
    setDailyRewardState({ dailyStreak: 3, lastClaimLocalDate: null });

    const screen = await renderWithProviders(
      <DailyRewardCard powerUpId="auroraDust" />
    );

    const card = screen.getByRole("figure", {
      name: getFigureName(1, "auroraDust", "claimed"),
    });

    await expect.element(card).toHaveAttribute("data-day", "1");
    await expect.element(card).toHaveAttribute("data-status", "claimed");
  });

  test.each([
    ["current", 4, "hasteRune", null] as const,
    ["locked", 5, "lightningShard", null] as const,
    ["next", 4, "hasteRune", getLocalDateString()] as const,
  ])("renders %s status in screen-reader caption", async (status, day, powerUpId, lastClaimLocalDate) => {
    setDailyRewardState({ dailyStreak: 3, lastClaimLocalDate });

    const screen = await renderWithProviders(
      <DailyRewardCard powerUpId={powerUpId} />
    );

    await expect
      .element(
        screen.getByRole("figure", {
          name: getFigureName(day, powerUpId, status),
        })
      )
      .toBeInTheDocument();
  });

  test("shows check icon in badge when claimed", async () => {
    setDailyRewardState({ dailyStreak: 3, lastClaimLocalDate: null });

    const screen = await renderWithProviders(
      <DailyRewardCard powerUpId="auroraDust" />
    );

    const card = screen.getByRole("figure", {
      name: getFigureName(1, "auroraDust", "claimed"),
    });

    await expect.poll(() => card.element().querySelector("svg")).not.toBeNull();
  });
});
