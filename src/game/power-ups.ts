// biome-ignore-all lint/performance/noBarrelFile: Re-exports keep @/game/power-ups import path stable after module split.

export {
  type ActivePowerUpDisplay,
  type ActivePowerUpDisplayKind,
  getActivePowerUpDisplayState,
  getActivePowerUpProgress,
  getActivePowerUpRemainingMs,
  getEffectiveProductionTime,
  getOfflineActiveBuffSeconds,
  getPowerUpDurationMs,
  getPowerUpIncomeMultiplier,
  getPowerUpTimeMultiplier,
  getYggdrasilAdvanceSeconds,
  isInstantPowerUp,
  isTimedPowerUpActive,
} from "./power-ups/effects";
export {
  type ActivePowerUp,
  addInventorySlot,
  canActivatePowerUp,
  consumeInventorySlot,
  hasActivatablePowerUp,
  type InventorySlot,
  isPowerUpId,
} from "./power-ups/inventory";
export {
  getRealmGoldPerSecond,
  type RealmEconomyInput,
  rollMimirCoinGold,
} from "./power-ups/realm-economy";
