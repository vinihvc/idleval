import { beforeEach, describe, expect, it, vi } from "vitest";
import { FACTORY_DATA } from "@/content/factories";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import {
  autoFactory,
  completeProductionCycle,
  setAmountBySelectedAmount,
  startProducing,
  unlockFactory,
  upgradeFactory,
} from "@/store/atoms/factories.actions";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getFactory } from "@/store/atoms/factories.selectors";
import { statisticsAtom } from "@/store/atoms/statistics";
import { getGold } from "@/store/atoms/wallet";
import { resetGame } from "@/store/reset";
import { seedFactory, seedGold } from "@/store/test-utils";
import { D, deserializeDecimal } from "@/utils/decimal";

vi.mock("@/providers/sound", () => ({
  sound: { play: vi.fn() },
}));

describe("factories.actions", () => {
  beforeEach(() => {
    resetGame();
    vi.mocked(sound.play).mockClear();
  });

  it("setAmountBySelectedAmount does nothing when gold is insufficient", () => {
    const before = store.get(factoriesAtom).grain.amount;

    setAmountBySelectedAmount("grain", 1);

    expect(store.get(factoriesAtom).grain.amount).toBe(before);
    expect(getGold().toNumber()).toBe(0);
  });

  it("setAmountBySelectedAmount buys units and deducts gold", () => {
    seedGold(10_000);
    const beforeAmount = store.get(factoriesAtom).grain.amount;

    setAmountBySelectedAmount("grain", 1);

    expect(store.get(factoriesAtom).grain.amount).toBe(beforeAmount + 1);
    expect(getGold().lt(D(10_000))).toBe(true);
    expect(
      deserializeDecimal(
        store.get(statisticsAtom).factories.grain.goldSpent
      ).gt(0)
    ).toBe(true);
  });

  it("startProducing sets isProducing and persists cycle timestamps", () => {
    const before = Date.now();

    startProducing("grain");

    const grain = store.get(factoriesAtom).grain;

    expect(grain.isProducing).toBe(true);
    expect(grain.productionStartedAt).toBeGreaterThanOrEqual(before);
    expect(grain.productionDurationSec).toBe(
      FACTORY_DATA.grain.productionTime
    );
  });

  it("startProducing is blocked for automated factories", () => {
    seedFactory("grain", { isAutomated: true });

    startProducing("grain");

    expect(store.get(factoriesAtom).grain.isProducing).toBe(false);
  });

  it("completeProductionCycle awards gold, clears cycle fields, and plays coin for manual production", () => {
    seedFactory("grain", {
      isProducing: true,
      amount: 2,
      productionStartedAt: 0,
      productionDurationSec: FACTORY_DATA.grain.productionTime,
    });
    const goldBefore = getGold();

    completeProductionCycle("grain");

    const grain = store.get(factoriesAtom).grain;

    expect(grain.isProducing).toBe(false);
    expect(grain.productionStartedAt).toBeNull();
    expect(grain.productionDurationSec).toBeNull();
    expect(getGold().gt(goldBefore)).toBe(true);
    expect(vi.mocked(sound.play)).toHaveBeenCalledWith("coin");
  });

  it("completeProductionCycle does not play coin for automated factories", () => {
    seedFactory("grain", {
      isAutomated: true,
      isProducing: false,
      amount: 1,
    });

    completeProductionCycle("grain");

    expect(vi.mocked(sound.play)).not.toHaveBeenCalled();
  });

  it("unlockFactory unlocks sealed factory and sets amount to 1", () => {
    seedGold(FACTORY_DATA.wine.unlockPrice);
    const unlockPrice = FACTORY_DATA.wine.unlockPrice;

    unlockFactory("wine");

    expect(store.get(factoriesAtom).wine.isUnlocked).toBe(true);
    expect(store.get(factoriesAtom).wine.amount).toBe(1);
    expect(getGold().toNumber()).toBe(0);
    expect(
      deserializeDecimal(store.get(statisticsAtom).factories.wine.goldSpent).eq(
        D(unlockPrice)
      )
    ).toBe(true);
  });

  it("autoFactory appoints manager when affordable", () => {
    const { managerCost: cost } = getFactory("grain");
    seedGold(cost.toNumber() + 1000);

    autoFactory("grain");

    expect(store.get(factoriesAtom).grain.isAutomated).toBe(true);
    expect(getGold().lt(cost.plus(1000))).toBe(true);
  });

  it("upgradeFactory purchases upgrade when affordable", () => {
    const { upgradeCost: cost } = getFactory("grain");
    seedGold(cost.toNumber() + 1000);

    upgradeFactory("grain");

    expect(store.get(factoriesAtom).grain.isUpgraded).toBe(true);
    expect(getGold().lt(cost.plus(1000))).toBe(true);
  });
});
