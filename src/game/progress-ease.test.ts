import { describe, expect, it } from "vitest";
import { PROGRESS_EASE } from "@/config/progress-ease";
import { FACTORY_TYPES } from "@/content/factories";
import { GOD_COUNT } from "@/content/gods";
import { createInitialFactoriesState } from "@/game/factories";
import {
  computeFactoryProgressScore,
  getFactoryProgressDifficulty,
  getGodInvokeDifficulty,
  getMaxFactoryProgressScore,
} from "@/game/progress-ease";

describe("progress ease", () => {
  it("getMaxFactoryProgressScore counts unlock, upgrade, and automate per factory", () => {
    expect(getMaxFactoryProgressScore()).toBe(FACTORY_TYPES.length * 3);
  });

  it("getFactoryProgressDifficulty starts at 1.25 with no factory milestones", () => {
    expect(
      getFactoryProgressDifficulty({
        factories: {},
        godsInvokedCount: 0,
      })
    ).toBe(PROGRESS_EASE.factory.startDifficulty);
  });

  it("getFactoryProgressDifficulty decays slightly when grain is already unlocked", () => {
    expect(
      getFactoryProgressDifficulty({
        factories: createInitialFactoriesState(),
        godsInvokedCount: 0,
      })
    ).toBeLessThan(PROGRESS_EASE.factory.startDifficulty);
  });

  it("getFactoryProgressDifficulty returns 1 after first god", () => {
    expect(
      getFactoryProgressDifficulty({
        factories: createInitialFactoriesState(),
        godsInvokedCount: 1,
      })
    ).toBe(1);
  });

  it("computeFactoryProgressScore increases with factory milestones", () => {
    const factories = createInitialFactoriesState();
    factories.grain.isAutomated = true;

    const score = computeFactoryProgressScore({
      factories,
      godsInvokedCount: 0,
    });

    expect(score).toBeGreaterThan(1);
  });

  it("getGodInvokeDifficulty is easier for first god and harder for last", () => {
    expect(getGodInvokeDifficulty(0)).toBe(
      PROGRESS_EASE.god.firstGodDifficulty
    );
    expect(getGodInvokeDifficulty(GOD_COUNT - 1)).toBeCloseTo(
      PROGRESS_EASE.god.minDifficulty
    );
    expect(getGodInvokeDifficulty(0)).toBeGreaterThan(
      getGodInvokeDifficulty(GOD_COUNT - 1)
    );
  });

  it("getGodInvokeDifficulty decreases monotonically by index", () => {
    let previous = getGodInvokeDifficulty(0);

    for (let index = 1; index < GOD_COUNT; index++) {
      const current = getGodInvokeDifficulty(index);
      expect(current).toBeLessThanOrEqual(previous);
      previous = current;
    }
  });
});
