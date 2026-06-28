import { describe, expect, it } from "vitest";
import { PROGRESS_EASE } from "@/config/progress-ease";
import { getFactoryProgressDifficulty } from "@/game/progress-ease";

describe("progress ease", () => {
  it("getFactoryProgressDifficulty returns the configured factory boost", () => {
    expect(getFactoryProgressDifficulty()).toBe(
      PROGRESS_EASE.factory.difficulty
    );
  });
});
