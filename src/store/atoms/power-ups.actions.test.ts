import { beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "@/providers/store";
import {
  getInventoryState,
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import { activatePowerUpAtSlot } from "@/store/atoms/power-ups.actions";
import { getGold } from "@/store/atoms/wallet";
import { resetGame } from "@/store/reset";

vi.mock("@/providers/sound", () => ({
  sound: { play: vi.fn() },
}));

describe("power-ups.actions", () => {
  beforeEach(() => {
    resetGame();
  });

  it("blocks using a second power-up while one is active", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [
        { powerUpId: "hasteRune", count: 1, tier: "common" },
        { powerUpId: "lightningShard", count: 1, tier: "common" },
      ],
    });

    expect(activatePowerUpAtSlot(0).success).toBe(true);
    expect(activatePowerUpAtSlot(1).success).toBe(false);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "lightningShard", count: 1, tier: "common" },
    ]);
  });

  it("grants gold when mimir coin is activated", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "mimirCoin", count: 1, tier: "common" }],
    });

    const goldBefore = getGold().toNumber();
    const result = activatePowerUpAtSlot(0);

    expect(result.success).toBe(true);
    expect(result.mimirCoinGold?.toNumber()).toBeGreaterThan(0);
    expect(getGold().toNumber()).toBeGreaterThan(goldBefore);
    expect(getInventoryState().slots).toEqual([]);
  });

  it("shifts relics left when the last unit in a stack is used", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [
        { powerUpId: "mimirCoin", count: 1, tier: "common" },
        { powerUpId: "hasteRune", count: 1, tier: "common" },
      ],
    });

    expect(activatePowerUpAtSlot(0).success).toBe(true);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "hasteRune", count: 1, tier: "common" },
    ]);
  });

  it("decrements stacked relics without shifting other slots", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "hasteRune", count: 2, tier: "common" }],
    });

    expect(activatePowerUpAtSlot(0).success).toBe(true);
    expect(getInventoryState().slots).toEqual([
      { powerUpId: "hasteRune", count: 1, tier: "common" },
    ]);
  });
});
