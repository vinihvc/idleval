import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { LOCAL_STORAGE_KEYS } from "@/config/local-storage-keys";
import { createEmptyPowerUpCounts, type PowerUpId } from "@/content/power-ups";
import {
  type ActivePowerUp,
  getDailyRewardOffer,
  getLocalDateString,
  hasActivatablePowerUp,
  hasPendingDailyReward,
} from "@/game/power-ups";
import { store } from "@/providers/store";
import { persistedAtom } from "@/store/storage";

export type { ActivePowerUp } from "@/game/power-ups";

export interface InventoryState {
  activePowerUp: ActivePowerUp | null;
  counts: Record<PowerUpId, number>;
  dailyStreak: number;
  lastClaimLocalDate: string | null;
  pendingCauldronDrop: boolean;
}

interface LegacyInventoryState {
  slots: unknown[];
}

const isInventoryState = (value: unknown): value is InventoryState =>
  typeof value === "object" &&
  value !== null &&
  "counts" in value &&
  "dailyStreak" in value;

const isLegacyInventoryState = (
  value: unknown
): value is LegacyInventoryState =>
  typeof value === "object" &&
  value !== null &&
  "slots" in value &&
  Array.isArray((value as LegacyInventoryState).slots);

export const createInitialInventoryState = (): InventoryState => ({
  counts: createEmptyPowerUpCounts(),
  dailyStreak: 0,
  lastClaimLocalDate: null,
  activePowerUp: null,
  pendingCauldronDrop: false,
});

export const initialInventoryState = createInitialInventoryState();

export const normalizeInventoryState = (value: unknown): InventoryState => {
  if (isInventoryState(value)) {
    return {
      ...createInitialInventoryState(),
      ...value,
      counts: {
        ...createEmptyPowerUpCounts(),
        ...value.counts,
      },
    };
  }

  if (isLegacyInventoryState(value)) {
    return createInitialInventoryState();
  }

  return createInitialInventoryState();
};

export const inventoryAtom = persistedAtom<InventoryState>(
  LOCAL_STORAGE_KEYS.inventory,
  initialInventoryState
);

export const getInventoryState = (): InventoryState =>
  normalizeInventoryState(store.get(inventoryAtom));

export const getPowerUpCount = (powerUpId: PowerUpId): number =>
  getInventoryState().counts[powerUpId] ?? 0;

export const getActivePowerUp = (): ActivePowerUp | null =>
  getInventoryState().activePowerUp;

export const getPendingCauldronDrop = (): boolean =>
  getInventoryState().pendingCauldronDrop;

export const getHasActivatablePowerUp = (): boolean => {
  const state = getInventoryState();

  return hasActivatablePowerUp(state.activePowerUp, state.counts);
};

export const getHasPendingDailyReward = (): boolean => {
  const state = getInventoryState();

  return hasPendingDailyReward(state.lastClaimLocalDate, getLocalDateString());
};

export const useInventoryState = () => useAtomValue(inventoryAtom);

export const useInventory = () => {
  const state = useInventoryState();
  const normalized = normalizeInventoryState(state);

  return {
    counts: normalized.counts,
    activePowerUp: normalized.activePowerUp,
    pendingCauldronDrop: normalized.pendingCauldronDrop,
  };
};

export const useDailyReward = () => {
  const state = useInventoryState();
  const normalized = normalizeInventoryState(state);
  const today = getLocalDateString();

  return {
    dailyStreak: normalized.dailyStreak,
    isPending: hasPendingDailyReward(normalized.lastClaimLocalDate, today),
    offer: getDailyRewardOffer(normalized.dailyStreak),
    today,
  };
};

export const useActivePowerUp = () => {
  const { activePowerUp } = useInventory();

  return activePowerUp;
};

export const useHasActivatablePowerUp = (): boolean => {
  const state = useInventoryState();
  const normalized = normalizeInventoryState(state);

  return useMemo(
    () => hasActivatablePowerUp(normalized.activePowerUp, normalized.counts),
    [normalized.activePowerUp, normalized.counts]
  );
};
