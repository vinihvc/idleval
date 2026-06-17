import { GAME_BALANCE } from "@/config/balance";
import {
  POWER_UP_EFFECTS,
  type PowerUpId,
  type PowerUpTier,
} from "@/content/power-ups";
import { D, type GameValue } from "@/utils/decimal";
import type { ActivePowerUp } from "./inventory";

/**
 * Seconds within `[lastSeenAt, now]` where a timed power-up was still active.
 *
 * @example
 * // 5 min buff, player away 20 min from activation
 * getOfflineActiveBuffSeconds(0, 1_200_000, { expiresAt: 300_000, ... }) // 300
 */
export const getOfflineActiveBuffSeconds = (
  lastSeenAt: number,
  now: number,
  activePowerUp: ActivePowerUp | null
): number => {
  if (!activePowerUp?.expiresAt) {
    return 0;
  }

  if (lastSeenAt >= activePowerUp.expiresAt) {
    return 0;
  }

  const buffEndMs = Math.min(now, activePowerUp.expiresAt);

  return Math.max(0, (buffEndMs - lastSeenAt) / 1000);
};

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
  if (
    isTimedPowerUpActive(activePowerUp, now) &&
    activePowerUp?.powerUpId === "lightningShard"
  ) {
    return D(GAME_BALANCE.powerUpIncomeMultiplier);
  }

  return D(1);
};

/**
 * Production-time multiplier granted by the Haste Rune timed buff.
 */
export const getPowerUpTimeMultiplier = (
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): number => {
  if (
    isTimedPowerUpActive(activePowerUp, now) &&
    activePowerUp?.powerUpId === "hasteRune"
  ) {
    return GAME_BALANCE.powerUpTimeMultiplier;
  }

  return 1;
};

export const getEffectiveProductionTime = (
  baseProductionTime: number,
  activePowerUp: ActivePowerUp | null,
  godsSpeedMultiplier = 1,
  now = Date.now()
): number => {
  const hasteMultiplier = getPowerUpTimeMultiplier(activePowerUp, now);

  return Math.max(
    1,
    Math.round((baseProductionTime * hasteMultiplier) / godsSpeedMultiplier)
  );
};

export const getYggdrasilAdvanceSeconds = (): number =>
  POWER_UP_EFFECTS.yggdrasilTear.advanceSeconds;

export const getPowerUpDurationMs = (powerUpId: PowerUpId): number | null => {
  const effect = POWER_UP_EFFECTS[powerUpId];

  if ("durationMs" in effect) {
    return effect.durationMs;
  }

  return null;
};

export const isInstantPowerUp = (powerUpId: PowerUpId): boolean =>
  powerUpId === "mimirCoin" || powerUpId === "yggdrasilTear";

export type ActivePowerUpDisplayKind = "timed";

export interface ActivePowerUpDisplay {
  kind: ActivePowerUpDisplayKind;
  powerUpId: PowerUpId;
  progress: number | null;
  remainingMs: number | null;
  tier: PowerUpTier;
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
 * Unified HUD state for timed buffs.
 */
export const getActivePowerUpDisplayState = (
  activePowerUp: ActivePowerUp | null,
  now = Date.now()
): ActivePowerUpDisplay | null => {
  if (!(isTimedPowerUpActive(activePowerUp, now) && activePowerUp)) {
    return null;
  }

  return {
    kind: "timed",
    powerUpId: activePowerUp.powerUpId,
    tier: activePowerUp.tier,
    remainingMs: getActivePowerUpRemainingMs(activePowerUp, now),
    progress: getActivePowerUpProgress(activePowerUp, now),
  };
};
