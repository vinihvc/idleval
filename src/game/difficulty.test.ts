import { describe, expect, it } from "vitest";
import {
  applyDifficultyCost,
  applyDifficultyIncome,
  DEFAULT_DIFFICULTY,
  DIFFICULTY_CONFIG,
  getCostMultiplier,
  getIncomeMultiplier,
  normalizeDifficultyLevel,
} from "@/game/difficulty";
import { D } from "@/utils/decimal";

describe("difficulty", () => {
  it("defaults to medium", () => {
    expect(DEFAULT_DIFFICULTY).toBe("medium");
    expect(getCostMultiplier("medium")).toBe(1);
    expect(getIncomeMultiplier("medium")).toBe(1);
  });

  it("normalizeDifficultyLevel falls back to medium for invalid values", () => {
    expect(normalizeDifficultyLevel(undefined)).toBe("medium");
    expect(normalizeDifficultyLevel("invalid")).toBe("medium");
    expect(normalizeDifficultyLevel("easy")).toBe("easy");
    expect(normalizeDifficultyLevel("veryHard")).toBe("veryHard");
  });

  it("applyDifficultyCost scales by cost multiplier", () => {
    expect(applyDifficultyCost(100, "easy").toNumber()).toBe(
      100 * DIFFICULTY_CONFIG.easy.cost
    );
    expect(applyDifficultyCost(100, "veryHard").toNumber()).toBe(
      100 * DIFFICULTY_CONFIG.veryHard.cost
    );
  });

  it("applyDifficultyIncome scales by income multiplier", () => {
    expect(applyDifficultyIncome(100, "easy").toNumber()).toBe(
      100 * DIFFICULTY_CONFIG.easy.income
    );
    expect(applyDifficultyIncome(100, "hard").toNumber()).toBe(
      100 * DIFFICULTY_CONFIG.hard.income
    );
  });

  it("medium leaves values unchanged", () => {
    expect(applyDifficultyCost(D(250), "medium").eq(D(250))).toBe(true);
    expect(applyDifficultyIncome(D(250), "medium").eq(D(250))).toBe(true);
  });
});
