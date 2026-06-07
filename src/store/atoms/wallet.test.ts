import { beforeEach, describe, expect, it } from "vitest";
import { store } from "@/providers/store";
import { resetGame } from "@/store/reset";
import { seedGold } from "@/store/test-utils";
import { D, deserializeDecimal } from "@/utils/decimal";
import {
  bulkIncreaseGold,
  decreaseGold,
  getGold,
  hasGoldToBuy,
  increaseGoldByAmount,
  walletAtom,
} from "./wallet";

describe("wallet", () => {
  beforeEach(() => {
    resetGame();
  });

  it("increaseGoldByAmount no-ops for non-positive amounts", () => {
    increaseGoldByAmount("grain", D(0));
    increaseGoldByAmount("grain", D(-5));

    expect(getGold().toNumber()).toBe(0);
  });

  it("increaseGoldByAmount adds gold and persists as string", () => {
    increaseGoldByAmount("grain", D(100));

    expect(getGold().toNumber()).toBe(100);
    expect(deserializeDecimal(store.get(walletAtom).gold).toNumber()).toBe(100);
  });

  it("bulkIncreaseGold aggregates entries and skips zero amounts", () => {
    bulkIncreaseGold([
      { factory: "grain", gold: D(50) },
      { factory: "mill", gold: D(0) },
      { factory: "iron", gold: D(25) },
    ]);

    expect(getGold().toNumber()).toBe(75);
  });

  it("bulkIncreaseGold no-ops when all entries are zero", () => {
    bulkIncreaseGold([
      { factory: "grain", gold: D(0) },
      { factory: "mill", gold: D(-1) },
    ]);

    expect(getGold().toNumber()).toBe(0);
  });

  it("decreaseGold subtracts from wallet", () => {
    seedGold(200);
    decreaseGold(75);

    expect(getGold().toNumber()).toBe(125);
  });

  it("hasGoldToBuy delegates to canAfford", () => {
    seedGold(100);

    expect(hasGoldToBuy(100)).toBe(true);
    expect(hasGoldToBuy(101)).toBe(false);
  });
});
