import { describe, expect, test } from "vitest";
import { DailyRewardDaySlot } from "@/components/dialog/daily-reward/daily-reward.day-slot";
import { getLocalizedPowerUp } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

const getFigureName = (
  day: number,
  powerUpId: "auroraDust",
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

describe("DailyRewardDaySlot", () => {
  test("renders day metadata and claimed status label", async () => {
    const screen = await renderWithProviders(
      <DailyRewardDaySlot day={3} powerUpId="auroraDust" status="claimed" />
    );

    const slot = screen.getByRole("figure", {
      name: getFigureName(3, "auroraDust", "claimed"),
    });

    await expect.element(slot).toHaveAttribute("data-day", "3");
    await expect.element(slot).toHaveAttribute("data-status", "claimed");
  });

  test.each([
    ["current", 1] as const,
    ["locked", 2] as const,
    ["next", 4] as const,
  ])("renders %s status in screen-reader caption", async (status, day) => {
    const screen = await renderWithProviders(
      <DailyRewardDaySlot day={day} powerUpId="auroraDust" status={status} />
    );

    await expect
      .element(
        screen.getByRole("figure", {
          name: getFigureName(day, "auroraDust", status),
        })
      )
      .toBeInTheDocument();
  });

  test("shows check icon in badge when claimed", async () => {
    const screen = await renderWithProviders(
      <DailyRewardDaySlot day={1} powerUpId="auroraDust" status="claimed" />
    );

    const slot = screen.getByRole("figure", {
      name: getFigureName(1, "auroraDust", "claimed"),
    });

    await expect.poll(() => slot.element().querySelector("svg")).not.toBeNull();
  });
});
