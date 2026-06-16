import { GOD_COUNT, GOD_DATA, type GodId } from "@/content/gods";
import { D, type GameValue } from "@/utils/decimal";

/**
 * Returns the gold threshold required to invoke a god by index.
 *
 * @example
 * getGodGoldRequired(0).toString() // "1e12"
 * getGodGoldRequired(1).toString() // "1e18"
 */
export const getGodGoldRequired = (index: number): GameValue =>
  D(GOD_DATA[index].goldRequired);

/**
 * Returns the cumulative production multiplier from all invoked gods.
 *
 * @example
 * getTotalProductionMultiplier([]).toNumber() // 1
 * getTotalProductionMultiplier(["huangdi"]).toNumber() // 2
 * getTotalProductionMultiplier(["huangdi", "dagda"]).toNumber() // 6
 */
export const getTotalProductionMultiplier = (invoked: GodId[]): GameValue => {
  let total = D(1);

  for (const god of GOD_DATA) {
    if (invoked.includes(god.id)) {
      total = total.times(god.productionMultiplier);
    }
  }

  return total;
};

export type GodCardStatus = "completed" | "available";

/**
 * Whether all gods have already been invoked.
 *
 * @example
 * isGodInvocationComplete(GOD_DATA.map((god) => god.id)) // true
 * isGodInvocationComplete([]) // false
 */
export const isGodInvocationComplete = (invoked: GodId[]): boolean =>
  invoked.length >= GOD_COUNT;

/**
 * Whether the god at the given index has already been invoked.
 */
const isGodInvoked = (godIndex: number, invoked: GodId[]): boolean =>
  invoked.includes(GOD_DATA[godIndex].id);

/**
 * UI-facing progression status for a god card.
 *
 * @example
 * getGodCardStatus(0, ["huangdi"]) // "completed"
 * getGodCardStatus(1, ["huangdi"]) // "available"
 * getGodCardStatus(2, ["huangdi"]) // "available"
 */
export const getGodCardStatus = (
  godIndex: number,
  invoked: GodId[]
): GodCardStatus =>
  isGodInvoked(godIndex, invoked) ? "completed" : "available";

/**
 * Whether the player can invoke the god at the given index.
 *
 * @example
 * canInvokeGodAtIndex(0, [], D("1e12")) // true
 * canInvokeGodAtIndex(1, [], D("1e18")) // true
 * canInvokeGodAtIndex(0, [], D(1)) // false
 */
export const canInvokeGodAtIndex = (
  godIndex: number,
  invoked: GodId[],
  gold: GameValue
): boolean => {
  if (isGodInvocationComplete(invoked)) {
    return false;
  }

  if (isGodInvoked(godIndex, invoked)) {
    return false;
  }

  return gold.gte(getGodGoldRequired(godIndex));
};

/**
 * Whether any uninvoked god can be invoked with the current gold balance.
 */
export const hasInvokableGod = (invoked: GodId[], gold: GameValue): boolean => {
  for (let index = 0; index < GOD_COUNT; index++) {
    if (canInvokeGodAtIndex(index, invoked, gold)) {
      return true;
    }
  }

  return false;
};
