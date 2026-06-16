import { beforeEach, describe, expect, test } from "vitest";
import { DailyRewardCard } from "@/components/dialog/daily-reward/daily-reward.card";
import type { PowerUpId } from "@/content/power-ups";
import { getLocalDateString } from "@/game/daily-reward";
import { store } from "@/providers/store";
import {
  dailyRewardAtom,
  initialDailyRewardState,
} from "@/store/atoms/daily-reward.atom";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

describe("DailyRewardCard", () => {
  beforeEach(() => {
    resetGame();
  });

  const setDailyRewardState = (options: {
    dailyStreak: number;
    lastClaimLocalDate: string | null;
  }) => {
    store.set(dailyRewardAtom, {
      ...initialDailyRewardState,
      dailyStreak: options.dailyStreak,
      lastClaimLocalDate: options.lastClaimLocalDate,
    });
  };

  test("renders claimed day with green badge and collected overlay", async () => {
    setDailyRewardState({ dailyStreak: 3, lastClaimLocalDate: null });

    const screen = await renderWithProviders(
      <DailyRewardCard day={1} powerUpId="mimirCoin" />
    );

    const badge = screen.getByText("01");

    await expect.element(badge).toHaveAttribute("data-variant", "green");
    await expect
      .poll(() => {
        const card = document.querySelector('[data-slot="power-up-card"]');

        return card?.querySelector("svg");
      })
      .not.toBeNull();
  });

  test.each([
    ["current", "hasteRune", 4, "04", "green", null] as const,
    ["locked", "mimirCoin", 2, "02", "brown", null] as const,
    ["next", "hasteRune", 4, "04", "brown", getLocalDateString()] as const,
  ])("renders %s status with expected badge styling", async (_status, powerUpId, day, dayLabel, badgeVariant, lastClaimLocalDate) => {
    const dailyStreak = _status === "locked" ? 0 : 3;

    setDailyRewardState({ dailyStreak, lastClaimLocalDate });

    const screen = await renderWithProviders(
      <DailyRewardCard day={day} powerUpId={powerUpId as PowerUpId} />
    );

    const badge = screen.getByText(dayLabel);

    await expect.element(badge).toHaveAttribute("data-variant", badgeVariant);
  });
});
