import { describe, expect, it } from "vitest";
import { PROGRESS_EASE } from "@/config/progress-ease";
import { FACTORY_TYPES } from "@/content/factories";
import { GOD_COUNT, GOD_DATA } from "@/content/gods";
import {
  getGodGoldRequired,
  getTotalProductionSpeedMultiplier,
} from "@/game/gods";
import {
  estimateMilestoneMinutes,
  getFactoryReferenceMetrics,
  getGodBonusAfterCount,
  getGodInvokeThresholds,
} from "@/game/progression-estimates";

describe("progression estimates", () => {
  it("getFactoryReferenceMetrics returns one row per factory", () => {
    expect(getFactoryReferenceMetrics()).toHaveLength(FACTORY_TYPES.length);
  });

  it("early grain income is boosted by factory ease", () => {
    const eased = getFactoryReferenceMetrics(
      PROGRESS_EASE.factory.startDifficulty
    )[0];
    const neutral = getFactoryReferenceMetrics(
      PROGRESS_EASE.factory.endDifficulty
    )[0];

    expect(eased.valuePerUnitPerCycle).toBeGreaterThan(
      neutral.valuePerUnitPerCycle
    );
  });

  it("getGodInvokeThresholds lists every god with speed multiplier above 1", () => {
    const thresholds = getGodInvokeThresholds();

    expect(thresholds).toHaveLength(GOD_COUNT);

    for (const threshold of thresholds) {
      expect(threshold.productionSpeedMultiplier).toBeGreaterThan(1);
    }
  });

  it("first god costs less than balance-only scaled threshold", () => {
    const firstEffective = getGodGoldRequired(0).toNumber();
    const balanceOnly = Number(GOD_DATA[0].goldRequired) * 0.8;

    expect(firstEffective).toBeLessThan(balanceOnly);
  });

  it("last god costs more than balance-only scaled threshold", () => {
    const lastIndex = GOD_COUNT - 1;
    const lastEffective = getGodGoldRequired(lastIndex).toNumber();
    const balanceOnly = Number(GOD_DATA[lastIndex].goldRequired) * 0.8;

    expect(lastEffective).toBeGreaterThan(balanceOnly);
  });

  it("getGodBonusAfterCount accumulates speed multiplicatively", () => {
    expect(getGodBonusAfterCount(2).speedMultiplier).toBeCloseTo(1.15 * 1.25);
    expect(getTotalProductionSpeedMultiplier(["huangdi", "dagda"])).toBeCloseTo(
      1.15 * 1.25
    );
  });

  it("estimateMilestoneMinutes returns ordered milestones", () => {
    const milestones = estimateMilestoneMinutes();

    expect(milestones.length).toBeGreaterThanOrEqual(4);
    expect(milestones[0]?.minutesMin).toBeLessThan(
      milestones[2]?.minutesMin ?? 0
    );
  });
});
