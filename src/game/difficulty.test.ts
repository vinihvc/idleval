import { describe, expect, it } from "vitest";
import {
  applyDifficultyCost,
  applyDifficultyIncome,
  getDifficultyCostMultiplier,
  getDifficultyIncomeMultiplier,
  getGameDifficulty,
} from "@/game/difficulty";
import { D } from "@/utils/decimal";

describe("difficulty", () => {
  it("defaults to baseline difficulty of 1", () => {
    expect(getGameDifficulty()).toBe(1);
    expect(getDifficultyCostMultiplier(1)).toBe(1);
    expect(getDifficultyIncomeMultiplier(1)).toBe(1);
  });

  it("applyDifficultyCost and applyDifficultyIncome are identity at difficulty 1", () => {
    expect(applyDifficultyCost(250, 1).eq(D(250))).toBe(true);
    expect(applyDifficultyIncome(250, 1).eq(D(250))).toBe(true);
  });

  it("applyDifficultyCost scales by cost multiplier", () => {
    expect(applyDifficultyCost(100, 1.2).toNumber()).toBeCloseTo(100 / 1.2);
    expect(applyDifficultyCost(100, 0.8).toNumber()).toBe(125);
  });

  it("applyDifficultyIncome scales by income multiplier", () => {
    expect(applyDifficultyIncome(100, 1.2).toNumber()).toBe(120);
    expect(applyDifficultyIncome(100, 0.8).toNumber()).toBe(80);
  });
});
