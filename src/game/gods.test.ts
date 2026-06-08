import { beforeEach, describe, expect, it } from "vitest";
import { GOD_COUNT, GOD_DATA } from "@/content/gods";
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

  it("getGodCardStatus returns completed or available", () => {
    expect(getGodCardStatus(0, ["huangdi"])).toBe("completed");
    expect(getGodCardStatus(1, ["huangdi"])).toBe("available");
    expect(getGodCardStatus(2, ["huangdi"])).toBe("available");
  });

  it("isGodInvocationComplete is true when all gods are invoked", () => {
    expect(isGodInvocationComplete(GOD_DATA.map((god) => god.id))).toBe(true);
    expect(
      isGodInvocationComplete(GOD_DATA.slice(0, -1).map((god) => god.id))
    ).toBe(false);
  });

  it("canInvokeGodAtIndex allows any uninvoked god with enough gold", () => {
    expect(canInvokeGodAtIndex(0, [], D("1e12"))).toBe(true);
    expect(canInvokeGodAtIndex(1, [], D("1e18"))).toBe(true);
    expect(canInvokeGodAtIndex(0, [], D(1))).toBe(false);
    expect(
      canInvokeGodAtIndex(
        0,
        GOD_DATA.map((god) => god.id),
        D("1e12")
      )
    ).toBe(false);
    expect(canInvokeGodAtIndex(0, ["huangdi"], D("1e12"))).toBe(false);
  });

  it("getTotalProductionMultiplier returns 1 with no invoked gods", () => {
    expect(getTotalProductionMultiplier([]).toNumber()).toBe(1);
  });

  it("getTotalProductionMultiplier accumulates invoked god multipliers", () => {
    expect(getTotalProductionMultiplier(["huangdi"]).toNumber()).toBe(
      GOD_DATA[0].productionMultiplier
    );

    let expected = D(1);
    for (const god of GOD_DATA.slice(0, 3)) {
      expected = expected.times(god.productionMultiplier);
    }

    expect(
      getTotalProductionMultiplier(["huangdi", "dagda", "shango"]).eq(expected)
    ).toBe(true);
  });

  it("getMultiplierAfterInvocation includes the selected god", () => {
    expect(
      getMultiplierAfterInvocation(0, []).eq(
        getTotalProductionMultiplier(["huangdi"])
      )
    ).toBe(true);
    expect(
      getMultiplierAfterInvocation(2, ["huangdi", "dagda"]).eq(
        getTotalProductionMultiplier(["huangdi", "dagda", "shango"])
      )
    ).toBe(true);
  });

  it("getGodGoldRequired returns configured threshold", () => {
    expect(getGodGoldRequired(0).eq(D(GOD_DATA[0].goldRequired))).toBe(true);
    expect(getGodGoldRequired(1).eq(D(GOD_DATA[1].goldRequired))).toBe(true);
  });

  it("getGodGoldRequired scales with difficulty cost multiplier", () => {
    setDifficulty("easy");
    expect(
      getGodGoldRequired(0).eq(D(GOD_DATA[0].goldRequired).times(0.6))
    ).toBe(true);

    setDifficulty("veryHard");
    expect(
      getGodGoldRequired(0).eq(D(GOD_DATA[0].goldRequired).times(2.5))
    ).toBe(true);
  });

  it("canInvokeGodAtIndex succeeds at exact gold threshold", () => {
    const required = getGodGoldRequired(0);

    expect(canInvokeGodAtIndex(0, [], required)).toBe(true);
    expect(canInvokeGodAtIndex(0, [], required.minus(1))).toBe(false);
  });

  it("isGodInvocationComplete is false below god count", () => {
    expect(isGodInvocationComplete([])).toBe(false);
    expect(
      isGodInvocationComplete(
        GOD_DATA.slice(0, GOD_COUNT - 1).map((god) => god.id)
      )
    ).toBe(false);
  });
});
