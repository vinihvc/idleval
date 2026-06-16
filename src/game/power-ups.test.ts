import { describe, expect, it } from "vitest";
import { createInitialFactoriesState } from "@/game/factories";
import {
  addInventorySlot,
  canActivatePowerUp,
  consumeInventorySlot,
  getActivePowerUpDisplayState,
  getActivePowerUpProgress,
  getActivePowerUpRemainingMs,
  getOfflineActiveBuffSeconds,
  getPowerUpIncomeMultiplier,
  getRealmGoldPerSecond,
  getYggdrasilAdvanceSeconds,
  hasActivatablePowerUp,
  isTimedPowerUpActive,
  rollMimirCoinGold,
} from "@/game/power-ups";

describe("power-ups", () => {
  it("detects activatable inventory power-ups", () => {
    expect(hasActivatablePowerUp(null, [])).toBe(false);

    expect(
      hasActivatablePowerUp(null, [
        { powerUpId: "mimirCoin", count: 1, tier: "common" },
      ])
    ).toBe(true);
  });

  it("stacks duplicate relics in the same slot", () => {
    const slots = addInventorySlot([], {
      powerUpId: "mimirCoin",
      tier: "common",
    });

    expect(
      addInventorySlot(slots, { powerUpId: "mimirCoin", tier: "common" })
    ).toEqual([{ powerUpId: "mimirCoin", count: 2, tier: "common" }]);
  });

  it("appends new relic types until the altar is full", () => {
    let slots = addInventorySlot([], {
      powerUpId: "mimirCoin",
      tier: "common",
    });
    slots = addInventorySlot(slots, {
      powerUpId: "hasteRune",
      tier: "common",
    });

    expect(slots).toEqual([
      { powerUpId: "mimirCoin", count: 1, tier: "common" },
      { powerUpId: "hasteRune", count: 1, tier: "common" },
    ]);
  });

  it("decrements stacked relics without shifting slots", () => {
    expect(
      consumeInventorySlot(
        [{ powerUpId: "mimirCoin", count: 2, tier: "common" }],
        0
      )
    ).toEqual([{ powerUpId: "mimirCoin", count: 1, tier: "common" }]);
  });

  it("removes empty stacks and shifts following relics left", () => {
    expect(
      consumeInventorySlot(
        [
          { powerUpId: "mimirCoin", count: 1, tier: "common" },
          { powerUpId: "hasteRune", count: 1, tier: "common" },
        ],
        0
      )
    ).toEqual([{ powerUpId: "hasteRune", count: 1, tier: "common" }]);
  });

  it("blocks activation while a timed power-up is active", () => {
    expect(
      canActivatePowerUp(
        {
          expiresAt: Date.now() + 10_000,
          powerUpId: "hasteRune",
          tier: "common",
        },
        2
      )
    ).toBe(false);
  });

  it("applies lightning shard income multiplier", () => {
    expect(
      getPowerUpIncomeMultiplier({
        expiresAt: Date.now() + 10_000,
        powerUpId: "lightningShard",
        tier: "common",
      }).toNumber()
    ).toBe(2);
  });

  it("returns remaining ms for timed power-ups", () => {
    const now = 1_000_000;
    const activePowerUp = {
      expiresAt: now + 30_000,
      powerUpId: "hasteRune" as const,
      tier: "common" as const,
    };

    expect(getActivePowerUpRemainingMs(activePowerUp, now)).toBe(30_000);
    expect(getActivePowerUpRemainingMs(activePowerUp, now + 30_000)).toBe(0);
    expect(getActivePowerUpRemainingMs(null, now)).toBe(0);
  });

  it("returns progress ratio for timed power-ups", () => {
    const now = 1_000_000;
    const activePowerUp = {
      expiresAt: now + 1_200_000,
      powerUpId: "hasteRune" as const,
      tier: "common" as const,
    };

    expect(getActivePowerUpProgress(activePowerUp, now + 600_000)).toBe(0.5);
    expect(getActivePowerUpProgress(activePowerUp, now + 1_200_000)).toBe(0);
  });

  it("measures how many offline seconds still had an active timed buff", () => {
    const activePowerUp = {
      expiresAt: 300_000,
      powerUpId: "lightningShard" as const,
      tier: "rare" as const,
    };

    expect(getOfflineActiveBuffSeconds(0, 1_200_000, activePowerUp)).toBe(300);
    expect(getOfflineActiveBuffSeconds(400_000, 1_200_000, activePowerUp)).toBe(
      0
    );
    expect(getOfflineActiveBuffSeconds(0, 120_000, activePowerUp)).toBe(120);
  });

  it("expires timed buffs by wall-clock expiresAt after simulated away time", () => {
    const now = 1_000_000;
    const activePowerUp = {
      expiresAt: now + 300_000,
      powerUpId: "lightningShard" as const,
      tier: "rare" as const,
    };

    expect(isTimedPowerUpActive(activePowerUp, now)).toBe(true);
    expect(isTimedPowerUpActive(activePowerUp, now + 299_999)).toBe(true);
    expect(isTimedPowerUpActive(activePowerUp, now + 300_000)).toBe(false);
    expect(
      getPowerUpIncomeMultiplier(activePowerUp, now + 300_000).toNumber()
    ).toBe(1);
  });

  it("maps active timed power-up to HUD display", () => {
    const now = 1_000_000;

    expect(
      getActivePowerUpDisplayState(
        {
          expiresAt: now + 10_000,
          powerUpId: "hasteRune",
          tier: "common",
        },
        now
      )
    ).toMatchObject({
      kind: "timed",
      powerUpId: "hasteRune",
      remainingMs: 10_000,
    });

    expect(getActivePowerUpDisplayState(null, now)).toBeNull();
  });

  it("uses automated factories for realm gold per second", () => {
    const factories = structuredClone(createInitialFactoriesState());
    factories.grain.isAutomated = true;

    expect(
      getRealmGoldPerSecond({ factories, godsInvoked: [] }).toNumber()
    ).toBe(10);
  });

  it("falls back to unlocked factories when none are automated", () => {
    const factories = structuredClone(createInitialFactoriesState());

    expect(
      getRealmGoldPerSecond({ factories, godsInvoked: [] }).toNumber()
    ).toBe(10);
  });

  it("applies mission renown to mimir coin realm rate", () => {
    const factories = structuredClone(createInitialFactoriesState());
    factories.grain.isAutomated = true;

    const base = getRealmGoldPerSecond({ factories, godsInvoked: [] }).toNumber();
    const withRenown = getRealmGoldPerSecond({
      factories,
      godsInvoked: [],
      renownPercent: 10,
    }).toNumber();

    expect(withRenown).toBeGreaterThan(base);
  });

  it("rolls mimir coin gold within tier bounds", () => {
    const factories = structuredClone(createInitialFactoriesState());
    factories.grain.isAutomated = true;
    const input = { factories, godsInvoked: [] };

    expect(
      rollMimirCoinGold("common", input, () => 0).toNumber()
    ).toBeGreaterThanOrEqual(450);
    expect(
      rollMimirCoinGold("common", input, () => 0.999).toNumber()
    ).toBeLessThanOrEqual(900);
  });

  it("advances yggdrasil tear by thirty minutes for every tier", () => {
    expect(getYggdrasilAdvanceSeconds()).toBe(1800);
  });
});
