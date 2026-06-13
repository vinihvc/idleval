import { describe, expect, it } from "vitest";
import { getDailyRewardDayStatus } from "@/components/dialog/daily-reward/daily-reward.card";

describe("getDailyRewardDayStatus", () => {
  it("marks earlier days as claimed and today as current when pending", () => {
    expect(getDailyRewardDayStatus(1, 4, true)).toBe("claimed");
    expect(getDailyRewardDayStatus(3, 4, true)).toBe("claimed");
    expect(getDailyRewardDayStatus(4, 4, true)).toBe("current");
    expect(getDailyRewardDayStatus(5, 4, true)).toBe("locked");
  });

  it("marks today as next when already claimed", () => {
    expect(getDailyRewardDayStatus(4, 4, false)).toBe("next");
  });
});
