import type { FactoryType } from "@/content/factories";
import { FACTORY_TYPES } from "@/content/factories";
import {
  DAILY_REWARD_CALENDAR,
  DAILY_REWARD_CYCLE_DAYS,
  POWER_UP_EFFECTS,
  POWER_UP_TYPES,
  type PowerUpId,
  type PowerUpTier,
  RELIC_SLOT_COUNT,
} from "@/content/power-ups";
import { D, type GameValue } from "@/utils/decimal";

export interface ActivePowerUp {
  expiresAt: number | null;
  ghostCandleFactory: FactoryType | null;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}

export interface DailyRewardOffer {
  dayInCycle: number;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}

export interface InventorySlot {
  count: number;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}

const MS_PER_DAY = 86_400_000;

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

export const isPowerUpId = (value: string): value is PowerUpId =>
  POWER_UP_TYPES.includes(value as PowerUpId);

/**
 * Whether a new power-up can be activated right now.
 */
export const canActivatePowerUp = (
  activePowerUp: ActivePowerUp | null,
  count: number,
  now = Date.now()
): boolean => {
  if (count <= 0) {
    return false;
  }

  if (!activePowerUp) {
    return true;
  }

  if (activePowerUp.expiresAt != null && now >= activePowerUp.expiresAt) {
    return true;
  }

  return false;
};

/**
 * Adds a relic to the compact altar array (stacks duplicates, appends new types).
 */
export const addInventorySlot = (
  slots: InventorySlot[],
  item: { powerUpId: PowerUpId; tier: PowerUpTier }
): InventorySlot[] => {
  const existingIndex = slots.findIndex(
    (slot) => slot.powerUpId === item.powerUpId
  );

  if (existingIndex >= 0) {
    return slots.map((slot, index) =>
      index === existingIndex ? { ...slot, count: slot.count + 1 } : slot
    );
  }

  if (slots.length >= RELIC_SLOT_COUNT) {
    return slots;
  }

  return [...slots, { powerUpId: item.powerUpId, count: 1, tier: item.tier }];
};

/**
 * Consumes one relic at the given index (decrements stack or removes slot).
 */
export const consumeInventorySlot = (
  slots: InventorySlot[],
  index: number
): InventorySlot[] => {
  const slot = slots[index];

  if (!slot || slot.count <= 0) {
    return slots;
  }

  if (slot.count > 1) {
    return slots.map((current, currentIndex) =>
      currentIndex === index
        ? { ...current, count: current.count - 1 }
        : current
    );
  }

  return [...slots.slice(0, index), ...slots.slice(index + 1)];
};

/**
 * Whether the player has at least one power-up ready to activate.
 */
export const hasActivatablePowerUp = (
  activePowerUp: ActivePowerUp | null,
  slots: InventorySlot[],
  now = Date.now()
): boolean =>
  slots.some((slot) => canActivatePowerUp(activePowerUp, slot.count, now));

export const isTimedPowerUpActive = (
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): boolean => {
  if (!activePowerUp) {
    return false;
  }

  if (activePowerUp.expiresAt == null) {
    return true;
  }

  return now < activePowerUp.expiresAt;
};

/**
 * Income multiplier granted by timed mystical effects.
 */
export const getPowerUpIncomeMultiplier = (
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): GameValue => {
  if (!(isTimedPowerUpActive(activePowerUp, now) && activePowerUp)) {
    return D(1);
  }

  if (activePowerUp.powerUpId === "auroraDust") {
    return D(POWER_UP_EFFECTS.auroraDust.incomeMultiplier);
  }

  if (activePowerUp.powerUpId === "lightningShard") {
    return D(POWER_UP_EFFECTS.lightningShard.incomeMultiplier);
  }

  return D(1);
};

/**
 * Production-time multiplier granted by Runa de Haste.
 */
export const getPowerUpTimeMultiplier = (
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): number => {
  if (
    isTimedPowerUpActive(activePowerUp, now) &&
    activePowerUp?.powerUpId === "hasteRune"
  ) {
    return POWER_UP_EFFECTS.hasteRune.timeMultiplier;
  }

  return 1;
};

export const getEffectiveProductionTime = (
  baseProductionTime: number,
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): number => {
  const multiplier = getPowerUpTimeMultiplier(activePowerUp, now);

  return Math.max(1, Math.round(baseProductionTime * multiplier));
};

export const isGhostCandleActiveForFactory = (
  factory: FactoryType,
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): boolean =>
  isTimedPowerUpActive(activePowerUp, now) &&
  activePowerUp?.powerUpId === "ghostCandle" &&
  activePowerUp.ghostCandleFactory === factory;

export const getCauldronDropMultiplier = (
  pendingCauldronDrop: boolean
): number =>
  pendingCauldronDrop ? POWER_UP_EFFECTS.cauldronDrop.nextCycleMultiplier : 1;

export const getYggdrasilAdvanceSeconds = (tier: PowerUpTier): number => {
  if (tier === "epic") {
    return POWER_UP_EFFECTS.yggdrasilTear.epicAdvanceSeconds;
  }

  return POWER_UP_EFFECTS.yggdrasilTear.advanceSeconds;
};

export const pickGhostCandleFactory = (
  factories: Record<FactoryType, { isAutomated: boolean; isUnlocked: boolean }>
): FactoryType | null => {
  const unlockedManual = FACTORY_TYPES.find(
    (factory) =>
      factories[factory].isUnlocked && !factories[factory].isAutomated
  );

  if (unlockedManual) {
    return unlockedManual;
  }

  return FACTORY_TYPES.find((factory) => factories[factory].isUnlocked) ?? null;
};

export const getPowerUpDurationMs = (powerUpId: PowerUpId): number | null => {
  const effect = POWER_UP_EFFECTS[powerUpId];

  if ("durationMs" in effect) {
    return effect.durationMs;
  }

  return null;
};

export const isInstantPowerUp = (powerUpId: PowerUpId): boolean =>
  powerUpId === "cauldronDrop" || powerUpId === "yggdrasilTear";

export type ActivePowerUpDisplayKind = "timed" | "pending-harvest";

export interface ActivePowerUpDisplay {
  ghostCandleFactory: FactoryType | null;
  kind: ActivePowerUpDisplayKind;
  powerUpId: PowerUpId;
  progress: number | null;
  remainingMs: number | null;
  tier: PowerUpTier;
}

export interface PowerUpDisplayInput {
  activePowerUp: ActivePowerUp | null;
  pendingCauldronDrop: boolean;
}

/**
 * Milliseconds left on a timed power-up (0 when inactive or expired).
 */
export const getActivePowerUpRemainingMs = (
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): number => {
  if (!(isTimedPowerUpActive(activePowerUp, now) && activePowerUp?.expiresAt)) {
    return 0;
  }

  return Math.max(0, activePowerUp.expiresAt - now);
};

/**
 * Remaining-time ratio for timed power-ups (1 = just activated, 0 = expired).
 */
export const getActivePowerUpProgress = (
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): number => {
  if (!(isTimedPowerUpActive(activePowerUp, now) && activePowerUp)) {
    return 0;
  }

  const durationMs = getPowerUpDurationMs(activePowerUp.powerUpId);

  if (!durationMs) {
    return 0;
  }

  const remainingMs = getActivePowerUpRemainingMs(activePowerUp, now);

  return Math.min(1, Math.max(0, remainingMs / durationMs));
};

/**
 * Unified HUD state for timed buffs and pending cauldron drop.
 */
export const getActivePowerUpDisplayState = (
  input: PowerUpDisplayInput,
  now = Date.now()
): ActivePowerUpDisplay | null => {
  const { activePowerUp, pendingCauldronDrop } = input;

  if (isTimedPowerUpActive(activePowerUp, now) && activePowerUp) {
    return {
      kind: "timed",
      powerUpId: activePowerUp.powerUpId,
      tier: activePowerUp.tier,
      remainingMs: getActivePowerUpRemainingMs(activePowerUp, now),
      progress: getActivePowerUpProgress(activePowerUp, now),
      ghostCandleFactory: activePowerUp.ghostCandleFactory,
    };
  }

  if (pendingCauldronDrop) {
    return {
      kind: "pending-harvest",
      powerUpId: "cauldronDrop",
      tier: "common",
      remainingMs: null,
      progress: null,
      ghostCandleFactory: null,
    };
  }

  return null;
};
