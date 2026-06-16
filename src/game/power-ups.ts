import {
  FACTORY_DATA,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import type { GodId } from "@/content/gods";
import {
  POWER_UP_EFFECTS,
  POWER_UP_TYPES,
  type PowerUpId,
  type PowerUpTier,
  RELIC_SLOT_COUNT,
} from "@/content/power-ups";
import {
  getFactoryEarnPerCycle,
  getFactoryGoldPerSecond,
} from "@/game/factories";
import { getTotalProductionMultiplier } from "@/game/gods";
import { getRenownProductionMultiplier } from "@/game/missions";
import type { FactoryPersistedState } from "@/game/types";
import { D, type GameValue } from "@/utils/decimal";

export interface ActivePowerUp {
  expiresAt: number | null;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}

export interface InventorySlot {
  count: number;
  powerUpId: PowerUpId;
  tier: PowerUpTier;
}

export interface RealmEconomyInput {
  factories: Record<FactoryType, FactoryPersistedState>;
  godsInvoked: GodId[];
  /** Permanent production bonus from mission renown (percent). */
  renownPercent?: number;
}

const sumGoldPerSecond = (
  factories: Record<FactoryType, FactoryPersistedState>,
  godsMultiplier: GameValue,
  filter: (state: FactoryPersistedState) => boolean
): GameValue => {
  let total = D(0);

  for (const factory of FACTORY_TYPES) {
    const state = factories[factory];

    if (!filter(state)) {
      continue;
    }

    total = total.plus(getFactoryGoldPerSecond(factory, state, godsMultiplier));
  }

  return total;
};

/**
 * Returns the realm's passive gold per second from automated production,
 * falling back to unlocked factories and then the starter grain rate.
 *
 * @example
 * getRealmGoldPerSecond({ factories, godsInvoked: [] }).toNumber() // > 0 at game start
 */
export const getRealmGoldPerSecond = (input: RealmEconomyInput): GameValue => {
  const godsMultiplier = getTotalProductionMultiplier(input.godsInvoked);
  const renownMultiplier = getRenownProductionMultiplier(
    input.renownPercent ?? 0
  );

  const applyRenown = (rate: GameValue): GameValue =>
    rate.times(renownMultiplier);

  const automatedRate = sumGoldPerSecond(
    input.factories,
    godsMultiplier,
    (state) => state.isUnlocked && state.isAutomated && state.amount > 0
  );

  if (automatedRate.gt(0)) {
    return applyRenown(automatedRate);
  }

  const unlockedRate = sumGoldPerSecond(
    input.factories,
    godsMultiplier,
    (state) => state.isUnlocked && state.amount > 0
  );

  if (unlockedRate.gt(0)) {
    return applyRenown(unlockedRate);
  }

  return applyRenown(
    getFactoryEarnPerCycle({
      amount: 1,
      godsProductionMultiplier: D(1),
      isUpgraded: false,
      productionValue: FACTORY_DATA.grain.productionValue,
    }).div(FACTORY_DATA.grain.productionTime)
  );
};

/**
 * Rolls a fair gold grant for Moeda de Mimir based on realm production and tier.
 *
 * @example
 * rollMimirCoinGold("common", input, () => 0).gte(getRealmGoldPerSecond(input).times(45))
 */
export const rollMimirCoinGold = (
  tier: PowerUpTier,
  input: RealmEconomyInput,
  random = Math.random
): GameValue => {
  const { min, max } = POWER_UP_EFFECTS.mimirCoin.rollSecondsByTier[tier];
  const seconds = min + random() * (max - min);

  return getRealmGoldPerSecond(input).times(seconds).floor();
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
