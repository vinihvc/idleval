import { describe, expect, it } from "vitest";
import {
  canPurchaseManager,
  canPurchaseUpgrade,
  canStartManualProduction,
  getFactoryYieldPerHour,
  getUpgradeMultiplierLabel,
  isFactoryProductionActive,
} from "@/game/factories";
import { D } from "@/utils/decimal";

describe("factories rules", () => {
  it("getFactoryYieldPerHour scales by cycle duration", () => {
    const yieldPerCycle = D(10);
    const yieldPerHour = getFactoryYieldPerHour(yieldPerCycle, 10);

    expect(yieldPerHour.toNumber()).toBe(3600);
  });

  it("getUpgradeMultiplierLabel reflects economy constant", () => {
    expect(getUpgradeMultiplierLabel()).toBe("2x");
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
  });
});
