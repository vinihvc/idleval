import { GOD_COUNT, GODS } from "@/content/gods";
import { applyDifficultyCost } from "@/game/difficulty";
import { getDifficultyLevel } from "@/store/atoms/settings";
import { D, type GameValue } from "@/utils/decimal";

/**
 * Returns the gold threshold required to invoke a god by index.
 *
 * @example
 * getGodGoldRequired(0).toString() // "1e12"
 * getGodGoldRequired(1).toString() // "1e18"
 */
export const getGodGoldRequired = (index: number): GameValue =>
  applyDifficultyCost(D(GODS[index].goldRequired), getDifficultyLevel());

/**
 * Returns the cumulative production multiplier from all invoked gods.
 *
 * @example
 * getTotalProductionMultiplier(0).toNumber() // 1
 * getTotalProductionMultiplier(1).toNumber() // 2
 * getTotalProductionMultiplier(2).toNumber() // 6
 */
export const getTotalProductionMultiplier = (level: number): GameValue => {
  let total = D(1);

  for (let index = 0; index < level && index < GOD_COUNT; index++) {
    total = total.times(GODS[index].productionMultiplier);
  }

  return total;
};

/**
 * Returns the production multiplier after invoking the god at the given index.
 *
 * @example
 * getMultiplierAfterInvocation(0).toNumber() // 2
 * getMultiplierAfterInvocation(1).toNumber() // 6
 */
export const getMultiplierAfterInvocation = (godIndex: number): GameValue =>
  getTotalProductionMultiplier(godIndex + 1);

export type GodCardStatus = "completed" | "available" | "locked" | "future";

/**
 * Whether all gods have already been invoked.
 *
 * @example
 * isGodInvocationComplete(GOD_COUNT) // true
 * isGodInvocationComplete(GOD_COUNT - 1) // false
 */
export const isGodInvocationComplete = (godsLevel: number): boolean =>
  godsLevel >= GOD_COUNT;

/**
 * UI-facing progression status for a god card.
 *
 * @example
 * getGodCardStatus(0, 1) // "completed"
 * getGodCardStatus(1, 1) // "available"
 * getGodCardStatus(2, 1) // "locked"
 * getGodCardStatus(3, 1) // "future"
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
 *
 * @example
 * canInvokeGodAtIndex(0, 0, D("1e12")) // true
 * canInvokeGodAtIndex(1, 0, D("1e12")) // false
 * canInvokeGodAtIndex(0, 0, D(1)) // false
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
