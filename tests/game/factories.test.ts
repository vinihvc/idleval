import { describe, expect, it } from "vitest";
import { BALANCE_BASELINE } from "@/config/balance";
import { getScaledProductionValue, getScaledUnlockPrice } from "@/game/balance";
import { applyDifficultyCost, getGameDifficulty } from "@/game/difficulty";
import {
  canPurchaseAnyManager,
  canPurchaseAnyUpgrade,
  canPurchaseManager,
  canPurchaseUpgrade,
  canStartManualProduction,
  createInitialFactoriesState,
  getFactoryEarnPerCycle,
  getFactoryGoldPerSecond,
  getFactoryProductionValue,
  getFactoryUnlockPrice,
  getFactoryYieldPerHour,
  isFactoryProductionActive,
} from "@/game/factories";
import { D } from "@/utils/decimal";

describe("factories rules", () => {
  it("getFactoryYieldPerHour scales by cycle duration", () => {
    const yieldPerCycle = D(10);
    const yieldPerHour = getFactoryYieldPerHour(yieldPerCycle, 10);

    expect(yieldPerHour.toNumber()).toBe(3600);
  });

  it("getFactoryProductionValue applies upgrade and god multipliers", () => {
    const base = {
      productionValue: 20,
      godsProductionMultiplier: D(3),
    };

    expect(
      getFactoryProductionValue({ ...base, isUpgraded: false }).toNumber()
    ).toBeCloseTo(getScaledProductionValue(20) * 3 * getGameDifficulty());
    expect(
      getFactoryProductionValue({ ...base, isUpgraded: true }).toNumber()
    ).toBeCloseTo(
      getScaledProductionValue(20) *
        BALANCE_BASELINE.upgradeProductionMultiplier *
        3 *
        getGameDifficulty()
    );
  });

  it("getFactoryUnlockPrice returns balance- and difficulty-scaled unlock cost", () => {
    expect(
      getFactoryUnlockPrice(55_000).eq(
        applyDifficultyCost(
          getScaledUnlockPrice(55_000),
          getGameDifficulty()
        )
      )
    ).toBe(true);
  });

  it("getFactoryEarnPerCycle scales by owned amount", () => {
    const perUnit = getFactoryProductionValue({
      productionValue: 10,
      isUpgraded: false,
      godsProductionMultiplier: D(1),
    });

    expect(
      getFactoryEarnPerCycle({
        amount: 0,
        productionValue: 10,
        isUpgraded: false,
        godsProductionMultiplier: D(1),
      }).toNumber()
    ).toBe(0);

    expect(
      getFactoryEarnPerCycle({
        amount: 3,
        productionValue: 10,
        isUpgraded: false,
        godsProductionMultiplier: D(1),
      }).eq(perUnit.times(3))
    ).toBe(true);
  });

  it("isFactoryProductionActive requires unlock and automation or producing", () => {
    expect(
      isFactoryProductionActive({
        isUnlocked: false,
        isAutomated: true,
        isProducing: false,
      })
    ).toBe(false);

    expect(
      isFactoryProductionActive({
        isUnlocked: true,
        isAutomated: false,
        isProducing: true,
      })
    ).toBe(true);

    expect(
      isFactoryProductionActive({
        isUnlocked: true,
        isAutomated: true,
        isProducing: false,
      })
    ).toBe(true);
  });

  it("canStartManualProduction blocks automated, locked, or active production", () => {
    expect(
      canStartManualProduction({
        isUnlocked: true,
        isAutomated: false,
        isProducing: false,
      })
    ).toBe(true);

    expect(
      canStartManualProduction({
        isUnlocked: true,
        isAutomated: true,
        isProducing: false,
      })
    ).toBe(false);

    expect(
      canStartManualProduction({
        isUnlocked: false,
        isAutomated: false,
        isProducing: false,
      })
    ).toBe(false);

    expect(
      canStartManualProduction({
        isUnlocked: true,
        isAutomated: false,
        isProducing: true,
      })
    ).toBe(false);
  });

  it("canPurchaseManager requires unlock, no manager, and enough gold", () => {
    expect(
      canPurchaseManager({
        isUnlocked: true,
        isAutomated: false,
        gold: D(100),
        cost: D(50),
      })
    ).toBe(true);

    expect(
      canPurchaseManager({
        isUnlocked: true,
        isAutomated: true,
        gold: D(100),
        cost: D(50),
      })
    ).toBe(false);

    expect(
      canPurchaseManager({
        isUnlocked: false,
        isAutomated: false,
        gold: D(100),
        cost: D(50),
      })
    ).toBe(false);

    expect(
      canPurchaseManager({
        isUnlocked: true,
        isAutomated: false,
        gold: D(40),
        cost: D(50),
      })
    ).toBe(false);
  });

  it("canPurchaseUpgrade requires unlock, no upgrade, and enough gold", () => {
    expect(
      canPurchaseUpgrade({
        isUnlocked: true,
        isUpgraded: false,
        gold: D(100),
        cost: D(50),
      })
    ).toBe(true);

    expect(
      canPurchaseUpgrade({
        isUnlocked: true,
        isUpgraded: true,
        gold: D(100),
        cost: D(50),
      })
    ).toBe(false);

    expect(
      canPurchaseUpgrade({
        isUnlocked: true,
        isUpgraded: false,
        gold: D(40),
        cost: D(50),
      })
    ).toBe(false);
  });

  it("getFactoryGoldPerSecond scales automated production by amount and gods", () => {
    const state = {
      amount: 2,
      isAutomated: true,
      isProducing: false,
      isUnlocked: true,
      isUpgraded: false,
      productionStartedAt: null,
      productionDurationSec: null,
    };

    const baseRate = getFactoryGoldPerSecond("grain", state, D(1)).toNumber();
    const boostedRate = getFactoryGoldPerSecond(
      "grain",
      state,
      D(2)
    ).toNumber();

    expect(boostedRate).toBe(baseRate * 2);
  });

  it("canPurchaseAnyUpgrade returns true when any factory can upgrade", () => {
    const factories = createInitialFactoriesState();

    expect(canPurchaseAnyUpgrade(factories, D(0))).toBe(false);
    expect(canPurchaseAnyUpgrade(factories, D(1_000_000))).toBe(true);
  });

  it("canPurchaseAnyManager returns true when any factory can hire a manager", () => {
    const factories = createInitialFactoriesState();

    expect(canPurchaseAnyManager(factories, D(0))).toBe(false);
    expect(canPurchaseAnyManager(factories, D(1_000_000))).toBe(true);
  });
});
