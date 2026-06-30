import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import type { FactoryType } from "@/content/factories";
import { store } from "@/providers/store";
import { incrementRunGoldEarned } from "@/store/atoms/missions.actions";
import { persistedAtomWithNormalize } from "@/store/storage";
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

const defaultWalletState = (): WalletState => ({
  gold: serializeDecimal(D(0)),
});

export const normalizeWalletState = (value: unknown): WalletState => {
  if (typeof value !== "object" || value === null) {
    return defaultWalletState();
  }

  const raw = value as Record<string, unknown>;

  if (typeof raw.gold !== "string") {
    return defaultWalletState();
  }

  try {
    const decimal = deserializeDecimal(raw.gold);
    const numeric = Number(decimal.toString());

    if (!Number.isFinite(numeric)) {
      return defaultWalletState();
    }

    return { gold: raw.gold };
  } catch {
    return defaultWalletState();
  }
};

export const walletAtom = persistedAtomWithNormalize(
  LOCAL_STORAGE.wallet,
  defaultWalletState(),
  normalizeWalletState
);

export const getGold = (): GameValue =>
  deserializeDecimal(store.get(walletAtom).gold);

export const useWalletState = () => useAtomValue(walletAtom);

export const useWallet = () => {
  const { gold } = useWalletState();

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
  incrementRunGoldEarned(goldEarned);

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

  incrementRunGoldEarned(total);

  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: serializeDecimal(deserializeDecimal(prev.gold).plus(total)),
  }));
};

export const decreaseGold = (amount: number | GameValue) => {
  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: serializeDecimal(deserializeDecimal(prev.gold).minus(D(amount))),
  }));
};
