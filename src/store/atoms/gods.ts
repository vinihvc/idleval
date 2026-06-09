import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { LOCAL_STORAGE_KEYS } from "@/config/local-storage-keys";
import { GOD_COUNT, GOD_DATA, type GodId } from "@/content/gods";
import { canInvokeGodAtIndex, getTotalProductionMultiplier } from "@/game/gods";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { resetRunProgress } from "@/store/reset-run-progress";
import { persistedAtomWithNormalize } from "@/store/storage";
import type { GameValue } from "@/utils/decimal";
import { getGold, useWallet } from "./wallet";

export interface GodsState {
  invoked: GodId[];
}

interface LegacyGodsState {
  count: number;
}

const isGodsState = (value: unknown): value is GodsState =>
  typeof value === "object" &&
  value !== null &&
  "invoked" in value &&
  Array.isArray(value.invoked);

const isLegacyGodsState = (value: unknown): value is LegacyGodsState =>
  typeof value === "object" &&
  value !== null &&
  "count" in value &&
  typeof value.count === "number";

export const normalizeGodsState = (value: unknown): GodsState => {
  if (isGodsState(value)) {
    return value;
  }

  if (isLegacyGodsState(value)) {
    return {
      invoked: GOD_DATA.slice(0, value.count).map((god) => god.id),
    };
  }

  return { invoked: [] };
};

export const godsAtom = persistedAtomWithNormalize<GodsState>(
  LOCAL_STORAGE_KEYS.gods,
  { invoked: [] },
  normalizeGodsState
);

export const useGodsState = () => useAtomValue(godsAtom);

export const useGods = () => {
  const state = useGodsState();
  const { invoked } = normalizeGodsState(state);

  return {
    invoked,
    count: invoked.length,
  };
};

let invokeInProgress = false;

export const getInvokedGods = (): GodId[] =>
  normalizeGodsState(store.get(godsAtom)).invoked;

export const getGodsProductionMultiplier = (): GameValue =>
  getTotalProductionMultiplier(getInvokedGods());

export const useGodsProductionMultiplier = (): GameValue => {
  const { invoked } = useGods();

  return getTotalProductionMultiplier(invoked);
};

export const canInvokeGod = (): boolean => {
  const invoked = getInvokedGods();
  const gold = getGold();

  for (let index = 0; index < GOD_COUNT; index++) {
    if (canInvokeGodAtIndex(index, invoked, gold)) {
      return true;
    }
  }

  return false;
};

export const useCanInvokeGod = (): boolean => {
  const { gold } = useWallet();
  const { invoked } = useGods();

  return useMemo(() => {
    for (let index = 0; index < GOD_COUNT; index++) {
      if (canInvokeGodAtIndex(index, invoked, gold)) {
        return true;
      }
    }

    return false;
  }, [gold, invoked]);
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
      const { invoked: invokedBefore } = normalizeGodsState(previous);
      const godId = GOD_DATA[godIndex].id;

      if (invokedBefore.includes(godId)) {
        return { invoked: invokedBefore };
      }

      return { invoked: [...invokedBefore, godId] };
    });

    resetRunProgress();
    sound.play("upgrade");

    return true;
  } finally {
    invokeInProgress = false;
  }
};
