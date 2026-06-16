import type { PowerUpId, PowerUpTier } from "@/content/power-ups";

export const DAILY_REWARD_CYCLE_DAYS = 6;

export const DAILY_REWARD_CALENDAR: {
  day: number;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}[] = [
  { day: 1, powerUpId: "mimirCoin", tier: "common" },
  { day: 2, powerUpId: "mimirCoin", tier: "common" },
  { day: 3, powerUpId: "hasteRune", tier: "uncommon" },
  { day: 4, powerUpId: "hasteRune", tier: "uncommon" },
  { day: 5, powerUpId: "lightningShard", tier: "rare" },
  { day: 6, powerUpId: "yggdrasilTear", tier: "epic" },
];
