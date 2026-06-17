import {
  type FactoryProgressInput,
  getFactoryProgressDifficulty as getFactoryProgressDifficultyFromGame,
} from "@/game/progress-ease";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getInvokedGods } from "@/store/atoms/gods";

export const buildFactoryProgressInput = (): FactoryProgressInput => ({
  factories: store.get(factoriesAtom),
  godsInvokedCount: getInvokedGods().length,
});

export const getFactoryProgressDifficulty = (): number =>
  getFactoryProgressDifficultyFromGame(buildFactoryProgressInput());
