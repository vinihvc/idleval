import { localizeLore } from "@/i18n/localize";

export const POWER_UP_TYPES = [
  "auroraDust",
  "ghostCandle",
  "cauldronDrop",
  "hasteRune",
  "lightningShard",
  "yggdrasilTear",
] as const;

export type PowerUpId = (typeof POWER_UP_TYPES)[number];

export type PowerUpTier = "common" | "uncommon" | "rare" | "epic";

export interface PowerUpData {
  image: string;
}

export const POWER_UP_DATA: Record<PowerUpId, PowerUpData> = {
  auroraDust: { image: "/images/power-ups/aurora-dust.webp" },
  ghostCandle: { image: "/images/power-ups/ghost-candle.webp" },
  cauldronDrop: { image: "/images/power-ups/cauldron-drop.webp" },
  hasteRune: { image: "/images/power-ups/haste-rune.webp" },
  lightningShard: { image: "/images/power-ups/lightning-shard.webp" },
  yggdrasilTear: { image: "/images/power-ups/yggdrasil-tear.webp" },
};

/** Relic altar slots (compact array) + ritual circles (2×5 grid). */
export const RELIC_SLOT_COUNT = 6;
export const RITUAL_SLOT_COUNT = 4;
export const INVENTORY_GRID_SIZE = RELIC_SLOT_COUNT + RITUAL_SLOT_COUNT;

export const DAILY_REWARD_CYCLE_DAYS = 6;

export const DAILY_REWARD_CALENDAR: {
  day: number;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}[] = [
  { day: 1, powerUpId: "auroraDust", tier: "common" },
  { day: 2, powerUpId: "ghostCandle", tier: "common" },
  { day: 3, powerUpId: "cauldronDrop", tier: "uncommon" },
  { day: 4, powerUpId: "hasteRune", tier: "uncommon" },
  { day: 5, powerUpId: "lightningShard", tier: "rare" },
  { day: 6, powerUpId: "yggdrasilTear", tier: "epic" },
];

export const POWER_UP_EFFECTS = {
  auroraDust: { incomeMultiplier: 1.5, durationMs: 60_000 },
  ghostCandle: { durationMs: 180_000 },
  cauldronDrop: { nextCycleMultiplier: 3 },
  hasteRune: { timeMultiplier: 0.6, durationMs: 120_000 },
  lightningShard: { incomeMultiplier: 2, durationMs: 45_000 },
  yggdrasilTear: { advanceSeconds: 30, epicAdvanceSeconds: 120 },
} as const;

export const getLocalizedPowerUp = (powerUpId: PowerUpId) =>
  localizeLore(`powerup.${powerUpId}`);
