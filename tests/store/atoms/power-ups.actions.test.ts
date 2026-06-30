import { beforeEach, describe, expect, it, vi } from "vitest";
import { startCycleTick } from "@/game/factory-cycle";
import { store } from "@/providers/store";
import {
  getInventoryState,
  initialInventoryState,
  inventoryAtom,
} from "@/store/atoms/inventory";
import {
  activatePowerUpAtSlot,
  refreshExpiredPowerUps,
} from "@/store/atoms/power-ups.actions";
import { productionTicksAtom } from "@/store/atoms/production-ticks.atom";
import { getGold } from "@/store/atoms/wallet";
import { resetGame } from "@/store/reset";
import { seedFactory } from "@/store/test-utils";

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

  it("returns false when the slot is empty", () => {
    expect(activatePowerUpAtSlot(0).success).toBe(false);
  });

  it("clears an expired active power-up", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      activePowerUp: {
        powerUpId: "hasteRune",
        tier: "common",
        expiresAt: Date.now() - 1000,
      },
    });

    refreshExpiredPowerUps();

    expect(getInventoryState().activePowerUp).toBeNull();
  });

  it("keeps a non-expired active power-up", () => {
    const expiresAt = Date.now() + 60_000;

    store.set(inventoryAtom, {
      ...initialInventoryState,
      activePowerUp: {
        powerUpId: "hasteRune",
        tier: "common",
        expiresAt,
      },
    });

    refreshExpiredPowerUps();

    expect(getInventoryState().activePowerUp?.expiresAt).toBe(expiresAt);
  });

  it("activates a timed power-up and stores activePowerUp", () => {
    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "hasteRune", count: 1, tier: "common" }],
    });

    const result = activatePowerUpAtSlot(0);

    expect(result.success).toBe(true);
    expect(getInventoryState().activePowerUp?.powerUpId).toBe("hasteRune");
    expect(getInventoryState().slots).toEqual([]);
  });

  it("advances production when yggdrasil tear is activated", () => {
    seedFactory("grain", {
      amount: 1,
      isAutomated: true,
      isUnlocked: true,
    });

    const now = Date.now();
    const tick = startCycleTick(store.get(productionTicksAtom).grain, {
      durationSec: 60,
      now,
    });

    store.set(productionTicksAtom, (previous) => ({
      ...previous,
      grain: tick,
    }));

    store.set(inventoryAtom, {
      ...initialInventoryState,
      slots: [{ powerUpId: "yggdrasilTear", count: 1, tier: "common" }],
    });

    const goldBefore = getGold().toNumber();
    const cycleKeyBefore = tick.cycleKey;

    expect(activatePowerUpAtSlot(0).success).toBe(true);

    const goldAfter = getGold().toNumber();
    const cycleKeyAfter = store.get(productionTicksAtom).grain.cycleKey;
    const productionChanged =
      goldAfter > goldBefore || cycleKeyAfter !== cycleKeyBefore;

    expect(productionChanged).toBe(true);
    expect(getInventoryState().slots).toEqual([]);
  });
});
