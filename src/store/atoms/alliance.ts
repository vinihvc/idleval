import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { store } from "@/store/store";
import { factoriesAtom, initialData } from "./factories";
import { walletAtom } from "./wallet";

export interface AllianceType {
  count: number;
}

export const allianceAtom = atomWithStorage<AllianceType>("alliance", {
  count: 0,
});

export const useAlliance = () => useAtomValue(allianceAtom);

export const canJoinAlliance = () => {
  const { gold } = store.get(walletAtom);

  if (gold < 1e6) {
    return false;
  }

  return gold >= 1e93;
};

export const joinAlliance = () => {
  const { gold } = store.get(walletAtom);

  if (gold < 1e36) {
    return;
  }

  store.set(allianceAtom, (prev) => ({
    count: prev.count + 1,
  }));

  store.set(walletAtom, (prev) => ({
    ...prev,
    gold: 0,
  }));

  store.set(factoriesAtom, initialData);
};
