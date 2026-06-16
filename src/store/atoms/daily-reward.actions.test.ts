import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalDateString } from "@/game/daily-reward";
import { store } from "@/providers/store";
import {
  claimDailyReward,
  refreshDailyStreakState,
} from "@/store/atoms/daily-reward.actions";
import {
  dailyRewardAtom,
  getDailyRewardState,
  initialDailyRewardState,
} from "@/store/atoms/daily-reward.atom";
import {
  getInventoryState,
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import { resetGame } from "@/store/reset";

vi.mock("@/providers/sound", () => ({
  sound: { play: vi.fn() },
}));

describe("daily-reward.actions", () => {
  beforeEach(() => {
    resetGame();
  });

  it("claims the fixed day-one reward and stacks duplicates", () => {
    expect(claimDailyReward()).toBe(true);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "mimirCoin", count: 1, tier: "common" },
    ]);
    expect(getDailyRewardState().dailyStreak).toBe(1);
    expect(getDailyRewardState().lastClaimLocalDate).toBe(getLocalDateString());

    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "mimirCoin", count: 2, tier: "common" }],
    });
    store.set(dailyRewardAtom, {
      ...initialDailyRewardState,
      dailyStreak: 0,
      lastClaimLocalDate: null,
    });

    expect(claimDailyReward()).toBe(true);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "mimirCoin", count: 3, tier: "common" },
    ]);
  });

  it("resets streak after missing a local day", () => {
    store.set(dailyRewardAtom, {
      ...initialDailyRewardState,
      dailyStreak: 4,
      lastClaimLocalDate: "2020-01-01",
    });

    refreshDailyStreakState();

    expect(getDailyRewardState().dailyStreak).toBe(0);
  });
});
