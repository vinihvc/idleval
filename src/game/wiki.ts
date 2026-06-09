import type { GodId } from "@/content/gods";
import { isGodInvoked } from "@/game/gods";
import type { FactoryPersistedState } from "@/game/types";

/**
 * Whether a god's codex entry can be read.
 *
 * @example
 * isWikiGodUnlocked(0, ["huangdi"]) // true
 * isWikiGodUnlocked(1, ["huangdi"]) // false
 */
export const isWikiGodUnlocked = (
  godIndex: number,
  invoked: GodId[]
): boolean => isGodInvoked(godIndex, invoked);

/**
 * Whether a manager's codex entry can be read.
 *
 * @example
 * isWikiFigureUnlocked({ isAutomated: true, ... }) // true
 */
export const isWikiFigureUnlocked = (
  factory: Pick<FactoryPersistedState, "isAutomated">
): boolean => factory.isAutomated;

/**
 * Whether an upgrade's codex entry can be read.
 *
 * @example
 * isWikiUpgradeUnlocked({ isUpgraded: true, ... }) // true
 */
export const isWikiUpgradeUnlocked = (
  factory: Pick<FactoryPersistedState, "isUpgraded">
): boolean => factory.isUpgraded;
