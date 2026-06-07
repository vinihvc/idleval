import { beforeEach, describe, expect, it } from "vitest";
import { GOD_COUNT, GODS } from "@/content/gods";
import {
  canInvokeGodAtIndex,
  getGodCardStatus,
  getGodGoldRequired,
  getMultiplierAfterInvocation,
  getTotalProductionMultiplier,
  isGodInvocationComplete,
} from "@/game/gods";
import { setDifficulty } from "@/store/atoms/settings";
import { D } from "@/utils/decimal";

describe("gods rules", () => {
  beforeEach(() => {
    setDifficulty("medium");
  });
  it("getGodCardStatus returns the four progression states", () => {
    expect(getGodCardStatus(0, 1)).toBe("completed");
    expect(getGodCardStatus(1, 1)).toBe("available");
    expect(getGodCardStatus(2, 1)).toBe("locked");
    expect(getGodCardStatus(3, 1)).toBe("future");
  });

  it("isGodInvocationComplete is true at god count", () => {
    expect(isGodInvocationComplete(GOD_COUNT)).toBe(true);
    expect(isGodInvocationComplete(GOD_COUNT - 1)).toBe(false);
  });

  it("canInvokeGodAtIndex only allows the next god with enough gold", () => {
    expect(canInvokeGodAtIndex(0, 0, D("1e12"))).toBe(true);
    expect(canInvokeGodAtIndex(1, 0, D("1e12"))).toBe(false);
    expect(canInvokeGodAtIndex(0, 0, D(1))).toBe(false);
    expect(canInvokeGodAtIndex(0, GOD_COUNT, D("1e12"))).toBe(false);
  });

  it("getTotalProductionMultiplier returns 1 at level zero", () => {
    expect(getTotalProductionMultiplier(0).toNumber()).toBe(1);
  });

  it("getTotalProductionMultiplier accumulates god multipliers", () => {
    expect(getTotalProductionMultiplier(1).toNumber()).toBe(
      GODS[0].productionMultiplier
    );

    let expected = D(1);
    for (let index = 0; index < 3; index++) {
      expected = expected.times(GODS[index].productionMultiplier);
    }

    expect(getTotalProductionMultiplier(3).eq(expected)).toBe(true);
  });

  it("getMultiplierAfterInvocation matches next level multiplier", () => {
    expect(
      getMultiplierAfterInvocation(0).eq(getTotalProductionMultiplier(1))
    ).toBe(true);
    expect(
      getMultiplierAfterInvocation(2).eq(getTotalProductionMultiplier(3))
    ).toBe(true);
  });

  it("getGodGoldRequired returns configured threshold", () => {
    expect(getGodGoldRequired(0).eq(D(GODS[0].goldRequired))).toBe(true);
    expect(getGodGoldRequired(1).eq(D(GODS[1].goldRequired))).toBe(true);
  });

  it("getGodGoldRequired scales with difficulty cost multiplier", () => {
    setDifficulty("easy");
    expect(getGodGoldRequired(0).eq(D(GODS[0].goldRequired).times(0.6))).toBe(
      true
    );

    setDifficulty("veryHard");
    expect(getGodGoldRequired(0).eq(D(GODS[0].goldRequired).times(2.5))).toBe(
      true
    );
  });

  it("canInvokeGodAtIndex succeeds at exact gold threshold", () => {
    const required = getGodGoldRequired(0);

    expect(canInvokeGodAtIndex(0, 0, required)).toBe(true);
    expect(canInvokeGodAtIndex(0, 0, required.minus(1))).toBe(false);
  });
});
