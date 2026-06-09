import { beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalDateString } from "@/game/power-ups";
import { store } from "@/providers/store";
import {
  getInventoryState,
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import {
  activatePowerUpAtSlot,
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
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "auroraDust", count: 1, tier: "common" },
    ]);
    expect(getInventoryState().dailyStreak).toBe(1);
    expect(getInventoryState().lastClaimLocalDate).toBe(getLocalDateString());

    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "auroraDust", count: 2, tier: "common" }],
      dailyStreak: 0,
      lastClaimLocalDate: null,
    });

    expect(claimDailyReward()).toBe(true);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "auroraDust", count: 3, tier: "common" },
    ]);
  });

  it("blocks using a second power-up while one is active", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [
        { powerUpId: "auroraDust", count: 1, tier: "common" },
        { powerUpId: "lightningShard", count: 1, tier: "common" },
      ],
    });

    expect(activatePowerUpAtSlot(0)).toBe(true);
    expect(activatePowerUpAtSlot(1)).toBe(false);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "lightningShard", count: 1, tier: "common" },
    ]);
  });

  it("shifts relics left when the last unit in a stack is used", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [
        { powerUpId: "auroraDust", count: 1, tier: "common" },
        { powerUpId: "ghostCandle", count: 1, tier: "common" },
      ],
    });

    expect(activatePowerUpAtSlot(0)).toBe(true);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "ghostCandle", count: 1, tier: "common" },
    ]);
  });

  it("decrements stacked relics without shifting other slots", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "auroraDust", count: 2, tier: "common" }],
    });

    expect(activatePowerUpAtSlot(0)).toBe(true);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "auroraDust", count: 1, tier: "common" },
    ]);
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
