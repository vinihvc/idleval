import { describe, expect, it } from "vitest";
import { BALANCE_BASELINE } from "@/config/balance";
import type { PowerUpId } from "@/content/power-ups";
import { POWER_UP_EFFECTS, RELIC_SLOT_COUNT } from "@/content/power-ups";
import { getGameDifficulty } from "@/game/difficulty";
import {
  createInitialFactoriesState,
  getFactoryGoldPerSecond,
} from "@/game/factories";
import {
  addInventorySlot,
  canActivatePowerUp,
  consumeInventorySlot,
  getActivePowerUpDisplayState,
  getActivePowerUpProgress,
  getActivePowerUpRemainingMs,
  getEffectiveProductionTime,
  getOfflineActiveBuffSeconds,
  getPowerUpIncomeMultiplier,
  getPowerUpTimeMultiplier,
  getRealmGoldPerSecond,
  getYggdrasilAdvanceSeconds,
  hasActivatablePowerUp,
  type InventorySlot,
  isTimedPowerUpActive,
  rollMimirCoinGold,
} from "@/game/power-ups";
import { D } from "@/utils/decimal";

const grainGoldPerSecond = (): number =>
  getFactoryGoldPerSecond("grain", createInitialFactoriesState().grain, D(1), {
    factoryDifficulty: getGameDifficulty(),
  }).toNumber();

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
    ).toBe(BALANCE_BASELINE.powerUpIncomeMultiplier * getGameDifficulty());
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
    ).toBe(grainGoldPerSecond());
  });

  it("falls back to unlocked factories when none are automated", () => {
    const factories = structuredClone(createInitialFactoriesState());

    expect(
      getRealmGoldPerSecond({ factories, godsInvoked: [] }).toNumber()
    ).toBe(grainGoldPerSecond());
  });

  it("applies mission renown to mimir coin realm rate", () => {
    const factories = structuredClone(createInitialFactoriesState());
    factories.grain.isAutomated = true;

    const base = getRealmGoldPerSecond({
      factories,
      godsInvoked: [],
    }).toNumber();
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
    const rate = getRealmGoldPerSecond(input);
    const { min, max } = POWER_UP_EFFECTS.mimirCoin.rollSecondsByTier.common;

    expect(
      rollMimirCoinGold("common", input, () => 0).toNumber()
    ).toBeGreaterThanOrEqual(rate.times(min).floor().toNumber());
    expect(
      rollMimirCoinGold("common", input, () => 0.999).toNumber()
    ).toBeLessThanOrEqual(rate.times(max).floor().toNumber());
  });

  it("advances yggdrasil tear by thirty minutes for every tier", () => {
    expect(getYggdrasilAdvanceSeconds()).toBe(1800);
  });

  it("drops new relic types when the altar is full", () => {
    const fullSlots: InventorySlot[] = Array.from(
      { length: RELIC_SLOT_COUNT },
      (_, index) => ({
        powerUpId: `slot-${index}` as PowerUpId,
        count: 1,
        tier: "common" as const,
      })
    );

    expect(
      addInventorySlot(fullSlots, {
        powerUpId: "yggdrasilTear",
        tier: "epic",
      })
    ).toBe(fullSlots);
  });

  it("ignores consumeInventorySlot for invalid indices", () => {
    const slots = [
      { powerUpId: "mimirCoin" as const, count: 1, tier: "common" as const },
    ];

    expect(consumeInventorySlot(slots, -1)).toBe(slots);
    expect(consumeInventorySlot(slots, 5)).toBe(slots);
  });

  it("applies haste and god speed to effective production time", () => {
    const activePowerUp = {
      expiresAt: Date.now() + 60_000,
      powerUpId: "hasteRune" as const,
      tier: "common" as const,
    };

    expect(getPowerUpTimeMultiplier(activePowerUp)).toBe(
      BALANCE_BASELINE.powerUpTimeMultiplier / getGameDifficulty()
    );
    expect(getEffectiveProductionTime(120, activePowerUp, 2)).toBe(
      Math.max(
        1,
        Math.round(
          (120 * (BALANCE_BASELINE.powerUpTimeMultiplier / getGameDifficulty())) /
            2
        )
      )
    );
    expect(getEffectiveProductionTime(120, null, 1)).toBe(120);
  });
});
