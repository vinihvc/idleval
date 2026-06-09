import { describe, expect, it } from "vitest";
import {
  addInventorySlot,
  canActivatePowerUp,
  consumeInventorySlot,
  getActivePowerUpDisplayState,
  getActivePowerUpProgress,
  getActivePowerUpRemainingMs,
  getDailyRewardOffer,
  getLocalDayDifference,
  getPowerUpIncomeMultiplier,
  hasActivatablePowerUp,
  hasPendingDailyReward,
  shouldResetDailyStreak,
} from "@/game/power-ups";

describe("power-ups", () => {
  it("detects missed daily claims", () => {
    expect(shouldResetDailyStreak("2026-06-06", "2026-06-08")).toBe(true);
    expect(shouldResetDailyStreak("2026-06-07", "2026-06-08")).toBe(false);
  });

  it("tracks pending daily rewards by local date", () => {
    expect(hasPendingDailyReward(null, "2026-06-08")).toBe(true);
    expect(hasPendingDailyReward("2026-06-08", "2026-06-08")).toBe(false);
    expect(hasPendingDailyReward("2026-06-07", "2026-06-08")).toBe(true);
  });

  it("detects activatable inventory power-ups", () => {
    expect(hasActivatablePowerUp(null, [])).toBe(false);

    expect(
      hasActivatablePowerUp(null, [
        { powerUpId: "auroraDust", count: 1, tier: "common" },
      ])
    ).toBe(true);
  });

  it("stacks duplicate relics in the same slot", () => {
    const slots = addInventorySlot([], {
      powerUpId: "auroraDust",
      tier: "common",
    });

    expect(
      addInventorySlot(slots, { powerUpId: "auroraDust", tier: "common" })
    ).toEqual([{ powerUpId: "auroraDust", count: 2, tier: "common" }]);
  });

  it("appends new relic types until the altar is full", () => {
    let slots = addInventorySlot([], {
      powerUpId: "auroraDust",
      tier: "common",
    });
    slots = addInventorySlot(slots, {
      powerUpId: "ghostCandle",
      tier: "common",
    });

    expect(slots).toEqual([
      { powerUpId: "auroraDust", count: 1, tier: "common" },
      { powerUpId: "ghostCandle", count: 1, tier: "common" },
    ]);
  });

  it("decrements stacked relics without shifting slots", () => {
    expect(
      consumeInventorySlot(
        [{ powerUpId: "auroraDust", count: 2, tier: "common" }],
        0
      )
    ).toEqual([{ powerUpId: "auroraDust", count: 1, tier: "common" }]);
  });

  it("removes empty stacks and shifts following relics left", () => {
    expect(
      consumeInventorySlot(
        [
          { powerUpId: "auroraDust", count: 1, tier: "common" },
          { powerUpId: "ghostCandle", count: 1, tier: "common" },
        ],
        0
      )
    ).toEqual([{ powerUpId: "ghostCandle", count: 1, tier: "common" }]);
  });

  it("maps streak days to the fixed reward calendar", () => {
    expect(getDailyRewardOffer(0)).toEqual({
      dayInCycle: 1,
      powerUpId: "auroraDust",
      tier: "common",
    });
    expect(getDailyRewardOffer(5)).toEqual({
      dayInCycle: 6,
      powerUpId: "yggdrasilTear",
      tier: "epic",
    });
    expect(getDailyRewardOffer(6)).toEqual({
      dayInCycle: 1,
      powerUpId: "auroraDust",
      tier: "common",
    });
  });

  it("blocks activation while a timed power-up is active", () => {
    expect(
      canActivatePowerUp(
        {
          expiresAt: Date.now() + 10_000,
          ghostCandleFactory: null,
          powerUpId: "auroraDust",
          tier: "common",
        },
        2
      )
    ).toBe(false);
  });

  it("applies aurora dust income multiplier", () => {
    expect(
      getPowerUpIncomeMultiplier({
        expiresAt: Date.now() + 10_000,
        ghostCandleFactory: null,
        powerUpId: "auroraDust",
        tier: "common",
      }).toNumber()
    ).toBe(1.5);
  });

  it("calculates local day differences", () => {
    expect(getLocalDayDifference("2026-06-08", "2026-06-10")).toBe(2);
  });

  it("returns remaining ms for timed power-ups", () => {
    const now = 1_000_000;
    const activePowerUp = {
      expiresAt: now + 30_000,
      ghostCandleFactory: null,
      powerUpId: "auroraDust" as const,
      tier: "common" as const,
    };

    expect(getActivePowerUpRemainingMs(activePowerUp, now)).toBe(30_000);
    expect(getActivePowerUpRemainingMs(activePowerUp, now + 30_000)).toBe(0);
    expect(getActivePowerUpRemainingMs(null, now)).toBe(0);
  });

  it("returns progress ratio for timed power-ups", () => {
    const now = 1_000_000;
    const activePowerUp = {
      expiresAt: now + 30_000,
      ghostCandleFactory: null,
      powerUpId: "auroraDust" as const,
      tier: "common" as const,
    };

    expect(getActivePowerUpProgress(activePowerUp, now)).toBe(0.5);
    expect(getActivePowerUpProgress(activePowerUp, now + 30_000)).toBe(0);
  });

  it("maps inventory state to HUD display", () => {
    const now = 1_000_000;

    expect(
      getActivePowerUpDisplayState(
        {
          activePowerUp: {
            expiresAt: now + 10_000,
            ghostCandleFactory: null,
            powerUpId: "hasteRune",
            tier: "common",
          },
          pendingCauldronDrop: false,
        },
        now
      )
    ).toMatchObject({
      kind: "timed",
      powerUpId: "hasteRune",
      remainingMs: 10_000,
    });

    expect(
      getActivePowerUpDisplayState(
        {
          activePowerUp: null,
          pendingCauldronDrop: true,
        },
        now
      )
    ).toMatchObject({
      kind: "pending-harvest",
      powerUpId: "cauldronDrop",
    });

    expect(
      getActivePowerUpDisplayState(
        {
          activePowerUp: null,
          pendingCauldronDrop: false,
        },
        now
      )
    ).toBeNull();
  });
});
