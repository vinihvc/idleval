import { store } from "@/providers/store";
import { factoriesAtom, initialData } from "@/store/atoms/factories";
import { mscAtom } from "@/store/atoms/msc";
import { walletAtom } from "@/store/atoms/wallet";
import { D, serializeDecimal } from "@/utils/decimal";

export const resetRunProgress = () => {
  store.set(walletAtom, { gold: serializeDecimal(D(0)) });
  store.set(factoriesAtom, initialData);
  store.set(mscAtom, { amountToBuy: 1 });
};
