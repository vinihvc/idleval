import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/providers/store";
import { resetGame } from "@/store/reset";
import { D, deserializeDecimal } from "@/utils/decimal";
import {
  recordGoldSpent,
  recordQuantity,
  setStatistics,
  statisticsAtom,
} from "./statistics";

describe("statistics", () => {
  beforeEach(() => {
    resetGame();
  });

  it("setStatistics increments global and per-factory gold earned", () => {
    setStatistics("grain", D(100));
    setStatistics("grain", D(50));
    setStatistics("wine", D(25));

    const stats = store.get(statisticsAtom);

    expect(deserializeDecimal(stats.goldEarned).toNumber()).toBe(175);
    expect(
      deserializeDecimal(stats.factories.grain.goldEarned).toNumber()
    ).toBe(150);
    expect(deserializeDecimal(stats.factories.wine.goldEarned).toNumber()).toBe(
      25
    );
  });

  it("recordGoldSpent no-ops for non-positive amounts", () => {
    recordGoldSpent("grain", D(0));
    recordGoldSpent("grain", D(-10));

    expect(
      deserializeDecimal(store.get(statisticsAtom).goldSpent).toNumber()
    ).toBe(0);
  });

  it("recordGoldSpent increments global and per-factory totals", () => {
    recordGoldSpent("grain", D(30));
    recordGoldSpent("grain", D(20));

    const stats = store.get(statisticsAtom);

    expect(deserializeDecimal(stats.goldSpent).toNumber()).toBe(50);
    expect(deserializeDecimal(stats.factories.grain.goldSpent).toNumber()).toBe(
      50
    );
  });

  it("recordQuantity no-ops for non-positive quantities", () => {
    recordQuantity("grain", 0);
    recordQuantity("grain", -1);

    expect(store.get(statisticsAtom).factories.grain.quantity).toBe(0);
  });

  it("recordQuantity increments per-factory quantity", () => {
    recordQuantity("grain", 2);
    recordQuantity("grain", 3);

    expect(store.get(statisticsAtom).factories.grain.quantity).toBe(5);
  });
});
