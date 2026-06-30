import { PLAYER_LEVEL } from "@/config/player-level";
import { GOD_COUNT } from "@/content/gods";
import type { MissionGameSnapshot } from "@/game/types";
import type { GameValue } from "@/utils/decimal";

const clampLevel = (value: number): number =>
  Math.min(
    PLAYER_LEVEL.maxLevel,
    Math.max(PLAYER_LEVEL.minLevel, Math.round(value))
  );

/**
 * Level points contributed by invoked gods (0..godsMaxPoints).
 *
 * @example
 * getGodLevelPoints(0) // 0
 * getGodLevelPoints(3) // 22 or 23
 */
export const getGodLevelPoints = (godsInvoked: number): number => {
  const clampedGods = Math.min(Math.max(0, godsInvoked), GOD_COUNT);

  return (clampedGods / GOD_COUNT) * PLAYER_LEVEL.godsMaxPoints;
};

/**
 * Level points contributed by current wallet gold (0..walletMaxPoints).
 *
 * @example
 * getWalletLevelPoints(D(0)) // 0
 * getWalletLevelPoints(D("1e12")) // ~33
 */
export const getWalletLevelPoints = (walletGold: GameValue): number => {
  if (walletGold.lte(0)) {
    return 0;
  }

  const walletLog = Number(walletGold.log(10));
  const normalized =
    (walletLog - PLAYER_LEVEL.walletLogMin) /
    (PLAYER_LEVEL.walletLogMax - PLAYER_LEVEL.walletLogMin);

  return Math.max(0, Math.min(1, normalized)) * PLAYER_LEVEL.walletMaxPoints;
};

/**
 * Returns the player's derived level from wallet gold and invoked gods.
 *
 * @example
 * getPlayerLevel({ walletGold: D(0), gods: { invoked: [] }, ... }) // 1
 */
export const getPlayerLevel = (snapshot: MissionGameSnapshot): number =>
  clampLevel(
    getGodLevelPoints(snapshot.gods.invoked.length) +
      getWalletLevelPoints(snapshot.walletGold)
  );

/**
 * Normalized progress within the level range (0 at level 1, 1 at level 100).
 *
 * @example
 * getPlayerLevelProgress(1) // 0
 * getPlayerLevelProgress(100) // 1
 */
export const getPlayerLevelProgress = (level: number): number => {
  const clamped = clampLevel(level);

  return (clamped - PLAYER_LEVEL.minLevel) / (PLAYER_LEVEL.maxLevel - 1);
};
