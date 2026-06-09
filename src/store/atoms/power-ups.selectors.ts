import {
  getCauldronDropMultiplier,
  getEffectiveProductionTime,
  getPowerUpIncomeMultiplier,
} from "@/game/power-ups";
import {
  getActivePowerUp,
  getPendingCauldronDrop,
} from "@/store/atoms/inventory";
import { D, type GameValue } from "@/utils/decimal";

export const getPowerUpIncomeMultiplierForEarn = (): GameValue =>
  getPowerUpIncomeMultiplier(getActivePowerUp());

export const getCauldronDropMultiplierForEarn = (): GameValue =>
  D(getCauldronDropMultiplier(getPendingCauldronDrop()));

export const getEffectiveProductionTimeForActivePowerUp = (
  baseProductionTime: number,
  now = Date.now()
): number =>
  getEffectiveProductionTime(baseProductionTime, getActivePowerUp(), now);
