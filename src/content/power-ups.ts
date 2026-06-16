import { translate, translateParams } from "@/i18n/localize";

export const POWER_UP_TYPES = [
  "mimirCoin",
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
  mimirCoin: { image: "/images/power-ups/mimir-coin.webp" },
  hasteRune: { image: "/images/power-ups/haste-rune.webp" },
  lightningShard: { image: "/images/power-ups/lightning-shard.webp" },
  yggdrasilTear: { image: "/images/power-ups/yggdrasil-tear.webp" },
};

/** Relic altar slots (compact array) + ritual circles (2×5 grid). */
export const RELIC_SLOT_COUNT = 6;
export const RITUAL_SLOT_COUNT = 4;
export const INVENTORY_GRID_SIZE = RELIC_SLOT_COUNT + RITUAL_SLOT_COUNT;

export const POWER_UP_EFFECTS = {
  mimirCoin: {
    rollSecondsByTier: {
      common: { min: 45, max: 90 },
      uncommon: { min: 90, max: 150 },
      rare: { min: 150, max: 240 },
      epic: { min: 240, max: 360 },
    },
  },
  hasteRune: { timeMultiplier: 0.6, durationMs: 1_200_000 },
  lightningShard: { incomeMultiplier: 2, durationMs: 900_000 },
  yggdrasilTear: { advanceSeconds: 1800 },
} as const;

const msToMinutes = (durationMs: number): string => String(durationMs / 60_000);

const getHasteRuneParams = (): Record<string, string> => {
  const { durationMs, timeMultiplier } = POWER_UP_EFFECTS.hasteRune;

  return {
    duration: msToMinutes(durationMs),
    timePercent: String(timeMultiplier * 100),
  };
};

const getLightningShardParams = (): Record<string, string> => {
  const { durationMs, incomeMultiplier } = POWER_UP_EFFECTS.lightningShard;

  return {
    duration: msToMinutes(durationMs),
    multiplier: String(incomeMultiplier),
  };
};

const getYggdrasilTearParams = (): Record<string, string> => {
  const { advanceSeconds } = POWER_UP_EFFECTS.yggdrasilTear;

  return {
    duration: String(advanceSeconds / 60),
    advanceSeconds: String(advanceSeconds),
  };
};

const getMimirCoinWikiParams = (): Record<string, string> => {
  const { rollSecondsByTier } = POWER_UP_EFFECTS.mimirCoin;

  return {
    commonMin: String(rollSecondsByTier.common.min),
    commonMax: String(rollSecondsByTier.common.max),
    uncommonMin: String(rollSecondsByTier.uncommon.min),
    uncommonMax: String(rollSecondsByTier.uncommon.max),
    rareMin: String(rollSecondsByTier.rare.min),
    rareMax: String(rollSecondsByTier.rare.max),
    epicMin: String(rollSecondsByTier.epic.min),
    epicMax: String(rollSecondsByTier.epic.max),
  };
};

const getPowerUpDescriptionParams = (
  powerUpId: PowerUpId
): Record<string, string> => {
  switch (powerUpId) {
    case "hasteRune":
      return getHasteRuneParams();
    case "lightningShard":
      return getLightningShardParams();
    case "yggdrasilTear":
      return getYggdrasilTearParams();
    case "mimirCoin":
      return {};
    default: {
      const _exhaustive: never = powerUpId;
      return _exhaustive;
    }
  }
};

const getPowerUpWikiMechanicsParams = (
  powerUpId: PowerUpId
): Record<string, string> => {
  switch (powerUpId) {
    case "hasteRune":
      return getHasteRuneParams();
    case "lightningShard":
      return getLightningShardParams();
    case "yggdrasilTear":
      return getYggdrasilTearParams();
    case "mimirCoin":
      return getMimirCoinWikiParams();
    default: {
      const _exhaustive: never = powerUpId;
      return _exhaustive;
    }
  }
};

export const getLocalizedPowerUp = (powerUpId: PowerUpId) => ({
  name: translate(`powerup.${powerUpId}.name`),
  description: translateParams(
    `powerup.${powerUpId}.description`,
    getPowerUpDescriptionParams(powerUpId)
  ),
});

export const getLocalizedPowerUpWikiMechanics = (powerUpId: PowerUpId) =>
  translateParams(
    `wiki.powerup.${powerUpId}.mechanics`,
    getPowerUpWikiMechanicsParams(powerUpId)
  );
