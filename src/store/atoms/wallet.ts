import { useAtomValue } from "jotai";
import { persistedAtom } from "@/store/storage";
import type { FactoryType } from "@/content/factories";
import { store } from "@/providers/store";
import {
  D,
  deserializeDecimal,
  type GameValue,
  serializeDecimal,
} from "@/utils/decimal";
import { setStatistics } from "./statistics";

interface WalletState {
  gold: string;
}

export const walletAtom = persistedAtom("wallet-v4", {
  gold: serializeDecimal(D(0)),
} satisfies WalletState);

export const getGold = (): GameValue =>
  deserializeDecimal(store.get(walletAtom).gold);

export const useWallet = () => {
  const { gold } = useAtomValue(walletAtom);

  return {
    gold: deserializeDecimal(gold),
  };
};

export const increaseGoldByAmount = (
  factory: FactoryType,
  goldEarned: GameValue
) => {
  if (goldEarned.lte(0)) {
    return;
  }

  setStatistics(factory, goldEarned);

  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: serializeDecimal(deserializeDecimal(prev.gold).plus(goldEarned)),
  }));
};

export const bulkIncreaseGold = (
  entries: { factory: FactoryType; gold: GameValue }[]
) => {
  let total = D(0);

  for (const { factory, gold } of entries) {
    if (gold.lte(0)) {
      continue;
    }

    setStatistics(factory, gold);
    total = total.plus(gold);
  }

  if (total.lte(0)) {
    return;
  }

  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: serializeDecimal(deserializeDecimal(prev.gold).plus(total)),
  }));
};

export const hasGoldToBuy = (price: number | GameValue) =>
  getGold().gte(D(price));

export const decreaseGold = (amount: number | GameValue) => {
  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: serializeDecimal(deserializeDecimal(prev.gold).minus(D(amount))),
  }));
};
