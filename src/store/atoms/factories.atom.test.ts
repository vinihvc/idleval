import { describe, expect, it } from "vitest";
import {
  initialData,
  normalizeFactoriesState,
} from "@/store/atoms/factories.atom";
import { normalizeStatisticsState } from "@/store/atoms/statistics";

describe("mill to wine save migration", () => {
  it("normalizeFactoriesState maps legacy mill key to wine", () => {
    const millState = {
      amount: 5,
      isProducing: false,
      isUpgraded: true,
      isAutomated: true,
      isUnlocked: true,
    };

    const legacy = {
      grain: initialData.grain,
      mill: millState,
      iron: initialData.iron,
      crossbow: initialData.crossbow,
      longship: initialData.longship,
      reliquary: initialData.reliquary,
    };

    const migrated = normalizeFactoriesState(legacy);

    expect(migrated.wine).toEqual(millState);
    expect("mill" in migrated).toBe(false);
  });

  it("normalizeFactoriesState prefers wine over legacy mill", () => {
    const legacy = {
      ...initialData,
      mill: {
        amount: 1,
        isProducing: false,
        isUpgraded: false,
        isAutomated: false,
        isUnlocked: true,
      },
      wine: {
        amount: 9,
        isProducing: false,
        isUpgraded: true,
        isAutomated: true,
        isUnlocked: true,
      },
    };

    const migrated = normalizeFactoriesState(legacy);

    expect(migrated.wine.amount).toBe(9);
  });

  it("normalizeStatisticsState maps legacy mill factory stats to wine", () => {
    const migrated = normalizeStatisticsState({
      goldEarned: "0",
      goldSpent: "0",
      factories: {
        mill: {
          quantity: 3,
          goldEarned: "100",
          goldSpent: "50",
        },
      },
    });

    expect(migrated.factories.wine.quantity).toBe(3);
    expect(migrated.factories.wine.goldEarned).toBe("100");
    expect(migrated.factories.wine.goldSpent).toBe("50");
  });
});
