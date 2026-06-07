import { useAtomValue } from "jotai";
import { canInvokeGodAtIndex, getTotalProductionMultiplier } from "@/game/gods";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { resetRunProgress } from "@/store/reset";
import { persistedAtom } from "@/store/storage";
import type { GameValue } from "@/utils/decimal";
import { getGold } from "./wallet";

export interface GodsState {
  count: number;
}

export const godsAtom = persistedAtom<GodsState>("gods", { count: 0 });

export const useGods = () => useAtomValue(godsAtom);

export const getGodsLevel = (): number => store.get(godsAtom).count;

export const getGodsProductionMultiplier = (): GameValue =>
  getTotalProductionMultiplier(getGodsLevel());

export const useGodsProductionMultiplier = (): GameValue => {
  const { count } = useGods();

  return getTotalProductionMultiplier(count);
};

export const canInvokeGod = (): boolean => {
  const level = getGodsLevel();

  return canInvokeGodAtIndex(level, level, getGold());
};

export const invokeGod = (): boolean => {
  const level = getGodsLevel();

  if (!canInvokeGodAtIndex(level, level, getGold())) {
    return false;
  }

  store.set(godsAtom, (prev) => ({
    count: prev.count + 1,
  }));

  resetRunProgress();
  sound.play("upgrade");

  return true;
};
