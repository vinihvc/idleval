import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalDateString } from "@/game/power-ups";
import { store } from "@/providers/store";
import {
  getInventoryState,
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import {
  activatePowerUp,
  claimDailyReward,
  refreshDailyStreakState,
} from "@/store/atoms/power-ups.actions";
import { resetGame } from "@/store/reset";

vi.mock("@/providers/sound", () => ({
  sound: { play: vi.fn() },
}));

describe("power-ups.actions", () => {
  beforeEach(() => {
    resetGame();
  });

  it("claims the fixed day-one reward and stacks duplicates", () => {
    expect(claimDailyReward()).toBe(true);
    expect(getInventoryState().counts.auroraDust).toBe(1);
    expect(getInventoryState().dailyStreak).toBe(1);
    expect(getInventoryState().lastClaimLocalDate).toBe(getLocalDateString());

    store.set(inventoryAtom, {
      ...initialInventoryState,
      counts: {
        ...initialInventoryState.counts,
        auroraDust: 2,
      },
      dailyStreak: 0,
      lastClaimLocalDate: null,
    });

    expect(claimDailyReward()).toBe(true);
    expect(getInventoryState().counts.auroraDust).toBe(3);
  });

  it("blocks using a second power-up while one is active", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      counts: {
        ...initialInventoryState.counts,
        auroraDust: 1,
        lightningShard: 1,
      },
    });

    expect(activatePowerUp("auroraDust")).toBe(true);
    expect(activatePowerUp("lightningShard")).toBe(false);
    expect(getInventoryState().counts.lightningShard).toBe(1);
  });

  it("resets streak after missing a local day", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      dailyStreak: 4,
      lastClaimLocalDate: "2020-01-01",
    });

    refreshDailyStreakState();

    expect(getInventoryState().dailyStreak).toBe(0);
  });
});
