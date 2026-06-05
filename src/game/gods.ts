import { GOD_COUNT, GODS } from "@/content/gods";
import { D, type GameValue } from "@/utils/decimal";

export const getGodGoldRequired = (index: number): GameValue =>
  D(GODS[index].goldRequired);

export const getTotalProductionMultiplier = (level: number): GameValue => {
  let total = D(1);

  for (let index = 0; index < level && index < GOD_COUNT; index++) {
    total = total.times(GODS[index].productionMultiplier);
  }

  return total;
};

export const getMultiplierAfterInvocation = (godIndex: number): GameValue =>
  getTotalProductionMultiplier(godIndex + 1);
