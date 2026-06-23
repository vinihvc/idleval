import { describe, expect, it } from "vitest";
import {
  getDailyRewardDayStatus,
  getDailyRewardOffer,
  getLocalDayDifference,
  hasPendingDailyReward,
  shouldResetDailyStreak,
} from "@/game/daily-reward";

describe("daily-reward", () => {
  it("detects missed daily claims", () => {
    expect(shouldResetDailyStreak("2026-06-06", "2026-06-08")).toBe(true);
    expect(shouldResetDailyStreak("2026-06-07", "2026-06-08")).toBe(false);
  });

  it("tracks pending daily rewards by local date", () => {
    expect(hasPendingDailyReward(null, "2026-06-08")).toBe(true);
    expect(hasPendingDailyReward("2026-06-08", "2026-06-08")).toBe(false);
    expect(hasPendingDailyReward("2026-06-07", "2026-06-08")).toBe(true);
  });

  it("maps calendar days to claimed, current, next, and locked states", () => {
    expect(getDailyRewardDayStatus(1, 4, true)).toBe("claimed");
    expect(getDailyRewardDayStatus(3, 4, true)).toBe("claimed");
    expect(getDailyRewardDayStatus(4, 4, true)).toBe("current");
    expect(getDailyRewardDayStatus(7, 6, true)).toBe("locked");
    expect(getDailyRewardDayStatus(6, 6, false)).toBe("next");
  });

  it("maps streak days to the fixed reward calendar", () => {
    expect(getDailyRewardOffer(0)).toEqual({
      dayInCycle: 1,
      powerUpId: "mimirCoin",
      tier: "common",
    });
    expect(getDailyRewardOffer(3)).toEqual({
      dayInCycle: 4,
      powerUpId: "hasteRune",
      tier: "uncommon",
    });
    expect(getDailyRewardOffer(5)).toEqual({
      dayInCycle: 6,
      powerUpId: "yggdrasilTear",
      tier: "epic",
    });
    expect(getDailyRewardOffer(6)).toEqual({
      dayInCycle: 1,
      powerUpId: "mimirCoin",
      tier: "common",
    });
  });

  it("calculates local day differences", () => {
    expect(getLocalDayDifference("2026-06-08", "2026-06-10")).toBe(2);
  });
});
