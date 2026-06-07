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

export type GodCardStatus = "completed" | "available" | "locked" | "future";

/**
 * Whether all gods have already been invoked.
 */
export const isGodInvocationComplete = (godsLevel: number): boolean =>
  godsLevel >= GOD_COUNT;

/**
 * UI-facing progression status for a god card.
 */
export const getGodCardStatus = (
  godIndex: number,
  godsLevel: number
): GodCardStatus => {
  if (godIndex < godsLevel) {
    return "completed";
  }

  if (godIndex === godsLevel) {
    return "available";
  }

  if (godIndex === godsLevel + 1) {
    return "locked";
  }

  return "future";
};

/**
 * Whether the player can invoke the god at the given index.
 */
export const canInvokeGodAtIndex = (
  godIndex: number,
  godsLevel: number,
  gold: GameValue
): boolean => {
  if (isGodInvocationComplete(godsLevel)) {
    return false;
  }

  if (godIndex !== godsLevel) {
    return false;
  }

  return gold.gte(getGodGoldRequired(godIndex));
};
