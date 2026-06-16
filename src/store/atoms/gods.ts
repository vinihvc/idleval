import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { LOCAL_STORAGE } from "@/config/local-storage";
import { GOD_DATA, type GodId } from "@/content/gods";
import {
  canInvokeGodAtIndex,
  getTotalProductionMultiplier,
  hasInvokableGod,
} from "@/game/gods";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { syncMissionProgress } from "@/store/atoms/missions.actions";
import { resetRunProgress } from "@/store/reset-run-progress";
import { persistedAtom } from "@/store/storage";
import type { GameValue } from "@/utils/decimal";
import { getGold, useWallet } from "./wallet";

export const fallingLeavesTriggerAtom = atom(0);

export const triggerFallingLeaves = (): void => {
  store.set(fallingLeavesTriggerAtom, (previous) => previous + 1);
};

export interface GodsState {
  invoked: GodId[];
}

export const godsAtom = persistedAtom<GodsState>(LOCAL_STORAGE.gods, {
  invoked: [],
});

export const useGodsState = () => useAtomValue(godsAtom);

export const useGods = () => {
  const { invoked } = useGodsState();

  return {
    invoked,
    count: invoked.length,
  };
};

let invokeInProgress = false;

export const getInvokedGods = (): GodId[] => store.get(godsAtom).invoked;

export const getGodsProductionMultiplier = (): GameValue =>
  getTotalProductionMultiplier(getInvokedGods());

export const useGodsProductionMultiplier = (): GameValue => {
  const { invoked } = useGods();

  return getTotalProductionMultiplier(invoked);
};

export const canInvokeGod = (): boolean =>
  hasInvokableGod(getInvokedGods(), getGold());

export const useCanInvokeGod = (): boolean => {
  const { gold } = useWallet();
  const { invoked } = useGods();

  return useMemo(() => hasInvokableGod(invoked, gold), [gold, invoked]);
};

export const invokeGod = (godIndex: number): boolean => {
  if (invokeInProgress) {
    return false;
  }

  invokeInProgress = true;

  try {
    const invoked = getInvokedGods();

    if (!canInvokeGodAtIndex(godIndex, invoked, getGold())) {
      return false;
    }

    store.set(godsAtom, (previous) => {
      const godId = GOD_DATA[godIndex].id;

      if (previous.invoked.includes(godId)) {
        return previous;
      }

      return { invoked: [...previous.invoked, godId] };
    });

    resetRunProgress();
    syncMissionProgress();
    sound.play("upgrade");

    return true;
  } finally {
    invokeInProgress = false;
  }
};
