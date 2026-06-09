import { useAtomValue } from "jotai";
import { LOCAL_STORAGE_KEYS } from "@/config/local-storage-keys";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import type { FactoryPersistedState } from "@/game/types";
import { persistedAtomWithNormalize } from "@/store/storage";

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

const isFactoryPersistedState = (
  value: unknown
): value is FactoryPersistedState =>
  typeof value === "object" &&
  value !== null &&
  "amount" in value &&
  typeof value.amount === "number";

const normalizeFactoriesState = (
  value: unknown
): Record<FactoryType, FactoryPersistedState> => {
  if (typeof value !== "object" || value === null) {
    return structuredClone(initialData);
  }

  const raw = value as Record<string, unknown>;
  const next = structuredClone(initialData);

  for (const factory of FACTORY_TYPES) {
    const saved = raw[factory];

    if (isFactoryPersistedState(saved)) {
      next[factory] = { ...next[factory], ...saved };
    }
  }

  return next;
};

export const factoriesAtom = persistedAtomWithNormalize<
  Record<FactoryType, FactoryPersistedState>
>(LOCAL_STORAGE_KEYS.factories, initialData, normalizeFactoriesState);

export const useFactories = () => useAtomValue(factoriesAtom);
