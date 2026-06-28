import { PROGRESS_EASE } from "@/config/progress-ease";

/**
 * Factory income/cost difficulty multiplier for progress ease.
 *
 * @example
 * getFactoryProgressDifficulty() // 1.3
 */
export const getFactoryProgressDifficulty = (): number =>
  PROGRESS_EASE.factory.difficulty;
