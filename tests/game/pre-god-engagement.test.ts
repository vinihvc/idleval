import { describe, expect, it } from "vitest";
import { PROGRESS_EASE } from "@/config/progress-ease";
import { FACTORY_DATA } from "@/content/factories";
import { unitCost } from "@/game/economy";
import {
  createInitialFactoryState,
  getFactoryGoldPerSecond,
} from "@/game/factories";
import { D } from "@/utils/decimal";

const PRE_GOD_DIFFICULTY = PROGRESS_EASE.factory.difficulty;
const MAX_PAYBACK_SECONDS = 3 * 60;

const getNextUnitPaybackSeconds = (
  factory: keyof typeof FACTORY_DATA,
  owned: number
): number => {
  const state = createInitialFactoryState(factory, { amount: owned });
  state.isUnlocked = true;
  state.isAutomated = true;

  const nextCost = unitCost(
    FACTORY_DATA[factory].baseBuyCost,
    owned,
    PRE_GOD_DIFFICULTY
  );
  const incomePerSecond = getFactoryGoldPerSecond(factory, state, D(1), {
    factoryDifficulty: PRE_GOD_DIFFICULTY,
  });

  return nextCost.div(incomePerSecond).toNumber();
};

describe("pre-god purchase engagement", () => {
  it("grain unit payback at thirty owned stays under three minutes", () => {
    expect(getNextUnitPaybackSeconds("grain", 30)).toBeLessThan(
      MAX_PAYBACK_SECONDS
    );
  });

  it("wine unit payback at fifteen owned stays under three minutes", () => {
    expect(getNextUnitPaybackSeconds("wine", 15)).toBeLessThan(
      MAX_PAYBACK_SECONDS
    );
  });
});
