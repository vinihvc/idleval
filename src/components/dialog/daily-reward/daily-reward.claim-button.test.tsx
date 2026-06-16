import { beforeEach, describe, expect, test } from "vitest";
import { DailyRewardClaimButton } from "@/components/dialog/daily-reward/daily-reward.claim-button";
import { getLocalDateString } from "@/game/daily-reward";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import {
  dailyRewardAtom,
  initialDailyRewardState,
} from "@/store/atoms/daily-reward.atom";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

describe("DailyRewardClaimButton", () => {
  beforeEach(() => {
    resetGame();
  });

  test("enables claim button when reward is pending", async () => {
    store.set(dailyRewardAtom, {
      ...initialDailyRewardState,
      dailyStreak: 0,
      lastClaimLocalDate: null,
    });

    const screen = await renderWithProviders(<DailyRewardClaimButton />);

    const button = screen.getByRole("button", { name: m["ui.daily.claim"]() });

    await expect.element(button).toBeEnabled();
  });

  test("disables claim button when reward was already claimed today", async () => {
    store.set(dailyRewardAtom, {
      ...initialDailyRewardState,
      dailyStreak: 2,
      lastClaimLocalDate: getLocalDateString(),
    });

    const screen = await renderWithProviders(<DailyRewardClaimButton />);

    const button = screen.getByRole("button", {
      name: m["ui.daily.claimed"](),
    });

    await expect.element(button).toBeDisabled();
  });

  test("announces claimed message when reward is collected", async () => {
    store.set(dailyRewardAtom, {
      ...initialDailyRewardState,
      dailyStreak: 0,
      lastClaimLocalDate: null,
    });

    const screen = await renderWithProviders(<DailyRewardClaimButton />);

    await screen.getByRole("button", { name: m["ui.daily.claim"]() }).click();

    await expect
      .poll(() => document.querySelector('[role="status"]')?.textContent)
      .toBe(m["ui.a11y.claimed"]());
  });
});
