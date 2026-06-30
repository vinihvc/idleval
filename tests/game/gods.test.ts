import { describe, expect, it } from "vitest";
import { BALANCE_BASELINE } from "@/config/balance";
import { GOD_COUNT, GOD_DATA } from "@/content/gods";
import { getScaledGodGoldRequired } from "@/game/balance";
import { applyDifficultyCost, getGameDifficulty } from "@/game/difficulty";
import {
  canInvokeGodAtIndex,
  getGodCardStatus,
  getGodGoldRequired,
  getTotalProductionMultiplier,
  getTotalProductionSpeedMultiplier,
  hasInvokableGod,
  isGodInvocationComplete,
} from "@/game/gods";
import { D } from "@/utils/decimal";

describe("gods rules", () => {
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
    expect(canInvokeGodAtIndex(0, [], getGodGoldRequired(0))).toBe(true);
    expect(canInvokeGodAtIndex(1, [], getGodGoldRequired(1))).toBe(true);
    expect(canInvokeGodAtIndex(0, [], D(1))).toBe(false);
    expect(
      canInvokeGodAtIndex(
        0,
        GOD_DATA.map((god) => god.id),
        getGodGoldRequired(0)
      )
    ).toBe(false);
    expect(canInvokeGodAtIndex(0, ["huangdi"], getGodGoldRequired(0))).toBe(
      false
    );
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

  it("hasInvokableGod is true when any god can be invoked", () => {
    expect(hasInvokableGod([], getGodGoldRequired(0))).toBe(true);
    expect(hasInvokableGod([], D(1))).toBe(false);
    expect(hasInvokableGod(["huangdi"], getGodGoldRequired(1))).toBe(true);
  });

  it("getTotalProductionSpeedMultiplier returns 1 with no invoked gods", () => {
    expect(getTotalProductionSpeedMultiplier([])).toBe(1);
  });

  it("getTotalProductionSpeedMultiplier accumulates invoked god speed multipliers", () => {
    expect(getTotalProductionSpeedMultiplier(["huangdi"])).toBe(
      GOD_DATA[0].productionSpeedMultiplier
    );

    let expected = 1;
    for (const god of GOD_DATA.slice(0, 3)) {
      expected *= god.productionSpeedMultiplier;
    }

    expect(
      getTotalProductionSpeedMultiplier(["huangdi", "dagda", "shango"])
    ).toBeCloseTo(expected);
  });

  it("getTotalProductionSpeedMultiplier is order independent", () => {
    expect(getTotalProductionSpeedMultiplier(["dagda", "huangdi"])).toBeCloseTo(
      getTotalProductionSpeedMultiplier(["huangdi", "dagda"])
    );
  });

  it("getGodGoldRequired returns balance-adjusted threshold", () => {
    expect(
      getGodGoldRequired(0).eq(
        applyDifficultyCost(
          D(getScaledGodGoldRequired(GOD_DATA[0].goldRequired)),
          getGameDifficulty()
        )
      )
    ).toBe(true);
    expect(getGodGoldRequired(0).toNumber()).toBeCloseTo(
      (Number(GOD_DATA[0].goldRequired) * BALANCE_BASELINE.godGoldRequired) /
        getGameDifficulty()
    );
    expect(
      getGodGoldRequired(GOD_COUNT - 1).eq(
        applyDifficultyCost(
          D(getScaledGodGoldRequired(GOD_DATA[GOD_COUNT - 1].goldRequired)),
          getGameDifficulty()
        )
      )
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
