import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { store } from "../store";
import { factoriesAtom, initialData } from "./factories";
import { walletAtom } from "./wallet";

export type AllianceType = {
  count: number;
};

export const allianceAtom = atomWithStorage<AllianceType>("alliance", {
  count: 0,
});

export const useAlliance = () => useAtomValue(allianceAtom);

export const canJoinAlliance = () => {
  const { money } = store.get(walletAtom);

  if (money < 1e6) {
    return false;
  }

  return money >= 1e93;
};

export const joinAlliance = () => {
  const { money } = store.get(walletAtom);

  if (money < 1e36) {
    return;
  }

  store.set(allianceAtom, (prev) => ({
    count: prev.count + 1,
  }));

  store.set(walletAtom, (prev) => ({
    ...prev,
    money: 0,
  }));

  store.set(factoriesAtom, initialData);
};
