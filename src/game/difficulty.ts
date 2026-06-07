import { D, type GameValue } from "@/utils/decimal";

export const DIFFICULTY_LEVELS = [
  "easy",
  "medium",
  "hard",
  "veryHard",
] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const DEFAULT_DIFFICULTY: DifficultyLevel = "medium";

export const DIFFICULTY_CONFIG: Record<
  DifficultyLevel,
  { cost: number; income: number }
> = {
  easy: { cost: 0.6, income: 1.4 },
  medium: { cost: 1, income: 1 },
  hard: { cost: 1.5, income: 0.75 },
  veryHard: { cost: 2.5, income: 0.5 },
};

export const DIFFICULTY_OPTIONS = [
  { value: "easy" as const, label: "Easy" },
  { value: "medium" as const, label: "Medium" },
  { value: "hard" as const, label: "Hard" },
  { value: "veryHard" as const, label: "Very Hard" },
] as const;

export const normalizeDifficultyLevel = (value: unknown): DifficultyLevel => {
  if (
    typeof value === "string" &&
    DIFFICULTY_LEVELS.includes(value as DifficultyLevel)
  ) {
    return value as DifficultyLevel;
  }

  return DEFAULT_DIFFICULTY;
};

export const getCostMultiplier = (level: DifficultyLevel): number =>
  DIFFICULTY_CONFIG[level].cost;

export const getIncomeMultiplier = (level: DifficultyLevel): number =>
  DIFFICULTY_CONFIG[level].income;

export const applyDifficultyCost = (
  value: number | GameValue,
  level: DifficultyLevel
): GameValue => D(value).times(getCostMultiplier(level));

export const applyDifficultyIncome = (
  value: number | GameValue,
  level: DifficultyLevel
): GameValue => D(value).times(getIncomeMultiplier(level));
