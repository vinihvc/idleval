import { persistedAtom } from "@/store/storage";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import type { FactoryPersistedState } from "@/game/types";

const INITIAL_FACTORY: FactoryType = "grain";

export const initialData = Object.fromEntries(
  FACTORY_TYPES.map((factory) => [
    factory,
    {
      amount: factory === INITIAL_FACTORY ? 1 : 0,
      isProducing: false,
      isUpgraded: false,
      isAutomated: false,
      isUnlocked: factory === INITIAL_FACTORY,
    },
  ])
) as Record<FactoryType, FactoryPersistedState>;

export const factoriesAtom = persistedAtom("factories", initialData);
