import { useAtomValue } from "jotai";
import React from "react";
import { LOCAL_STORAGE } from "@/config/local-storage";
import {
  type ActivePowerUp,
  getEffectiveProductionTime,
  getPowerUpIncomeMultiplier,
  hasActivatablePowerUp,
  type InventorySlot,
  isPowerUpId,
  isTimedPowerUpActive,
} from "@/game/power-ups";
import { store } from "@/providers/store";
import { getGodsProductionSpeedMultiplier } from "@/store/atoms/gods";
import { persistedAtomWithNormalize } from "@/store/storage";
import type { GameValue } from "@/utils/decimal";

export type { ActivePowerUp, InventorySlot } from "@/game/power-ups";

export interface InventoryState {
  activePowerUp: ActivePowerUp | null;
  slots: InventorySlot[];
}

export const createInitialInventoryState = (): InventoryState => ({
  slots: [],
  activePowerUp: null,
});

export const initialInventoryState = createInitialInventoryState();

const isInventorySlot = (value: unknown): value is InventorySlot =>
  typeof value === "object" &&
  value !== null &&
  "powerUpId" in value &&
  typeof value.powerUpId === "string" &&
  "count" in value &&
  typeof value.count === "number" &&
  "tier" in value &&
  typeof value.tier === "string";

const normalizeActivePowerUp = (value: unknown): ActivePowerUp | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const raw = value as ActivePowerUp;

  if (!isPowerUpId(raw.powerUpId)) {
    return null;
  }

  if (raw.expiresAt != null && !isTimedPowerUpActive(raw)) {
    return null;
  }

  return {
    powerUpId: raw.powerUpId,
    tier: raw.tier,
    expiresAt: raw.expiresAt,
  };
};

const normalizeInventoryState = (value: unknown): InventoryState => {
  if (typeof value !== "object" || value === null) {
    return createInitialInventoryState();
  }

  const raw = value as Partial<InventoryState> & {
    pendingCauldronDrop?: boolean;
    dailyStreak?: number;
    lastClaimLocalDate?: string | null;
  };

  const slots = Array.isArray(raw.slots)
    ? raw.slots.filter(
        (slot): slot is InventorySlot =>
          isInventorySlot(slot) && isPowerUpId(slot.powerUpId)
      )
    : [];

  return {
    slots,
    activePowerUp: normalizeActivePowerUp(raw.activePowerUp),
  };
};

export const inventoryAtom = persistedAtomWithNormalize<InventoryState>(
  LOCAL_STORAGE.inventory,
  initialInventoryState,
  normalizeInventoryState
);

export const getInventoryState = (): InventoryState => store.get(inventoryAtom);

export const getActivePowerUp = (): ActivePowerUp | null =>
  getInventoryState().activePowerUp;

export const getPowerUpIncomeMultiplierForEarn = (): GameValue =>
  getPowerUpIncomeMultiplier(getActivePowerUp());

export const getEffectiveProductionTimeForActivePowerUp = (
  baseProductionTime: number,
  now = Date.now()
): number =>
  getEffectiveProductionTime(
    baseProductionTime,
    getActivePowerUp(),
    getGodsProductionSpeedMultiplier(),
    now
  );

export const getHasActivatablePowerUp = (): boolean => {
  const state = getInventoryState();

  return hasActivatablePowerUp(state.activePowerUp, state.slots);
};

export const useInventoryState = () => useAtomValue(inventoryAtom);

export const useInventory = () => {
  const state = useInventoryState();

  return {
    slots: state.slots,
    activePowerUp: state.activePowerUp,
  };
};

export const useHasActivatablePowerUp = (): boolean => {
  const state = useInventoryState();

  return React.useMemo(
    () => hasActivatablePowerUp(state.activePowerUp, state.slots),
    [state.activePowerUp, state.slots]
  );
};
