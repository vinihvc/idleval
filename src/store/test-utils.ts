import type { FactoryType } from "@/content/factories";
import type { FactoryPersistedState } from "@/game/types";
import { store } from "@/providers/store";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { resetGame } from "@/store/reset";
import { D, serializeDecimal } from "@/utils/decimal";
import { walletAtom } from "./atoms/wallet";

export const seedGold = (amount: number | string) => {
  store.set(walletAtom, { gold: serializeDecimal(D(amount)) });
};

export const seedFactory = (
  factory: FactoryType,
  partial: Partial<FactoryPersistedState>
) => {
  store.set(factoriesAtom, (previous) => ({
    ...previous,
    [factory]: {
      ...previous[factory],
      ...partial,
    },
  }));
};

export const setupStoreTest = () => {
  resetGame();
};
