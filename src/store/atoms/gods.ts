import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { GOD_COUNT } from "@/content/gods";
import { getGodGoldRequired, getTotalProductionMultiplier } from "@/game/gods";
import { sound } from "@/providers/sound";
import { store } from "@/providers/store";
import { resetRunProgress } from "@/store/reset";
import type { GameValue } from "@/utils/decimal";
import { getGold } from "./wallet";

export interface GodsState {
  count: number;
}

export const godsAtom = atomWithStorage<GodsState>("gods", { count: 0 });

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

  if (level >= GOD_COUNT) {
    return false;
  }

  const gold = getGold();
  const required = getGodGoldRequired(level);

  return gold.gte(required);
};

export const invokeGod = (): boolean => {
  const level = getGodsLevel();

  if (level >= GOD_COUNT) {
    return false;
  }

  const gold = getGold();
  const required = getGodGoldRequired(level);

  if (gold.lt(required)) {
    return false;
  }

  store.set(godsAtom, (prev) => ({
    count: prev.count + 1,
  }));

  resetRunProgress();

  return true;
};
