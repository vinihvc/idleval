import {
  POWER_UP_TYPES,
  type PowerUpId,
  type PowerUpTier,
  RELIC_SLOT_COUNT,
} from "@/content/power-ups";

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
 *
 * When the altar already holds `RELIC_SLOT_COUNT` distinct relic types and the
 * item is new, the slot is dropped silently and the input array is returned unchanged.
 *
 * @example
 * addInventorySlot([], { powerUpId: "hasteRune", tier: "common" })
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
