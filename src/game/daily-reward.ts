import {
  DAILY_REWARD_CALENDAR,
  DAILY_REWARD_CYCLE_DAYS,
} from "@/content/daily-reward";
import type { PowerUpId, PowerUpTier } from "@/content/power-ups";

const MS_PER_DAY = 86_400_000;

export interface DailyRewardOffer {
  dayInCycle: number;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}

export type DailyRewardDayStatus = "claimed" | "current" | "locked" | "next";

/**
 * Returns the player's current local calendar date as YYYY-MM-DD.
 */
export const getLocalDateString = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value: string): Date => new Date(`${value}T00:00:00`);

/**
 * Whole-day difference between two local calendar dates.
 */
export const getLocalDayDifference = (from: string, to: string): number => {
  const start = parseLocalDate(from).getTime();
  const end = parseLocalDate(to).getTime();

  return Math.round((end - start) / MS_PER_DAY);
};

/**
 * Resets streak when the player missed one or more local days without claiming.
 */
export const shouldResetDailyStreak = (
  lastClaimLocalDate: string | null,
  todayLocalDate: string
): boolean => {
  if (!lastClaimLocalDate) {
    return false;
  }

  return getLocalDayDifference(lastClaimLocalDate, todayLocalDate) > 1;
};

/**
 * Whether a daily reward can still be claimed today.
 */
export const hasPendingDailyReward = (
  lastClaimLocalDate: string | null,
  todayLocalDate: string
): boolean => {
  if (!lastClaimLocalDate) {
    return true;
  }

  return lastClaimLocalDate !== todayLocalDate;
};

/**
 * Maps the current streak to the next reward in the fixed calendar.
 */
export const getDailyRewardOffer = (dailyStreak: number): DailyRewardOffer => {
  const dayInCycle = (dailyStreak % DAILY_REWARD_CYCLE_DAYS) + 1;
  const reward =
    DAILY_REWARD_CALENDAR.find((entry) => entry.day === dayInCycle) ??
    DAILY_REWARD_CALENDAR[0];

  return {
    dayInCycle,
    powerUpId: reward.powerUpId,
    tier: reward.tier,
  };
};

/**
 * Calendar cell state for the daily reward strip.
 *
 * @example
 * getDailyRewardDayStatus(4, 4, true) // "current"
 * getDailyRewardDayStatus(4, 4, false) // "next"
 */
export const getDailyRewardDayStatus = (
  day: number,
  dayInCycle: number,
  isPending: boolean
): DailyRewardDayStatus => {
  if (day < dayInCycle) {
    return "claimed";
  }

  if (day > dayInCycle) {
    return "locked";
  }

  return isPending ? "current" : "next";
};
