import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { LOCAL_STORAGE } from "@/config/local-storage";
import {
  type ActivePowerUp,
  getDailyRewardOffer,
  getLocalDateString,
  hasActivatablePowerUp,
  hasPendingDailyReward,
  type InventorySlot,
} from "@/game/power-ups";
import { store } from "@/providers/store";
import { persistedAtom } from "@/store/storage";

export type { ActivePowerUp, InventorySlot } from "@/game/power-ups";

export interface InventoryState {
  activePowerUp: ActivePowerUp | null;
  dailyStreak: number;
  lastClaimLocalDate: string | null;
  pendingCauldronDrop: boolean;
  slots: InventorySlot[];
}

export const createInitialInventoryState = (): InventoryState => ({
  slots: [],
  dailyStreak: 0,
  lastClaimLocalDate: null,
  activePowerUp: null,
  pendingCauldronDrop: false,
});

export const initialInventoryState = createInitialInventoryState();

export const inventoryAtom = persistedAtom<InventoryState>(
  LOCAL_STORAGE.inventory,
  initialInventoryState
);

export const getInventoryState = (): InventoryState => store.get(inventoryAtom);

export const getActivePowerUp = (): ActivePowerUp | null =>
  getInventoryState().activePowerUp;

export const getPendingCauldronDrop = (): boolean =>
  getInventoryState().pendingCauldronDrop;

export const getHasActivatablePowerUp = (): boolean => {
  const state = getInventoryState();

  return hasActivatablePowerUp(state.activePowerUp, state.slots);
};

export const getHasPendingDailyReward = (): boolean => {
  const state = getInventoryState();

  return hasPendingDailyReward(state.lastClaimLocalDate, getLocalDateString());
};

export const useInventoryState = () => useAtomValue(inventoryAtom);

export const useInventory = () => {
  const state = useInventoryState();

  return {
    slots: state.slots,
    activePowerUp: state.activePowerUp,
    pendingCauldronDrop: state.pendingCauldronDrop,
  };
};

export const useDailyReward = () => {
  const state = useInventoryState();
  const today = getLocalDateString();

  return {
    dailyStreak: state.dailyStreak,
    isPending: hasPendingDailyReward(state.lastClaimLocalDate, today),
    offer: getDailyRewardOffer(state.dailyStreak),
    today,
  };
};

export const useHasActivatablePowerUp = (): boolean => {
  const state = useInventoryState();

  return useMemo(
    () => hasActivatablePowerUp(state.activePowerUp, state.slots),
    [state.activePowerUp, state.slots]
  );
};
