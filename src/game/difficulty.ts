import { GAME_DIFFICULTY } from "@/config/game";
import { D, type GameValue } from "@/utils/decimal";

/**
 * Returns the active game difficulty multiplier.
 *
 * @example
 * getGameDifficulty() // 1
 */
export const getGameDifficulty = (): number => GAME_DIFFICULTY;

/**
 * Cost multiplier for a given difficulty.
 * Higher difficulty values make costs lower.
 *
 * @example
 * getDifficultyCostMultiplier(1.2) // ~0.833
 * getDifficultyCostMultiplier(0.8) // 1.25
 */
export const getDifficultyCostMultiplier = (difficulty: number): number =>
  1 / difficulty;

/**
 * Income multiplier for a given difficulty.
 * Higher difficulty values make income higher.
 *
 * @example
 * getDifficultyIncomeMultiplier(1.2) // 1.2
 * getDifficultyIncomeMultiplier(0.8) // 0.8
 */
export const getDifficultyIncomeMultiplier = (difficulty: number): number =>
  difficulty;

/**
 * Scales a cost by the difficulty cost multiplier.
 *
 * @example
 * applyDifficultyCost(100, 1.2).toNumber() // ~83.33
 * applyDifficultyCost(100, 0.8).toNumber() // 125
 */
export const applyDifficultyCost = (
  value: number | GameValue,
  difficulty: number = getGameDifficulty()
): GameValue => D(value).times(getDifficultyCostMultiplier(difficulty));

/**
 * Scales income by the difficulty income multiplier.
 *
 * @example
 * applyDifficultyIncome(100, 1.2).toNumber() // 120
 * applyDifficultyIncome(100, 0.8).toNumber() // 80
 */
export const applyDifficultyIncome = (
  value: number | GameValue,
  difficulty: number = getGameDifficulty()
): GameValue => D(value).times(getDifficultyIncomeMultiplier(difficulty));
