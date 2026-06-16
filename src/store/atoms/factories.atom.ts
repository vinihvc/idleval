import { useAtomValue } from "jotai";
import { LOCAL_STORAGE } from "@/config/local-storage";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { createInitialFactoriesState } from "@/game/factories";
import type { FactoryPersistedState } from "@/game/types";
import { persistedAtomWithNormalize } from "@/store/storage";

export const initialData = createInitialFactoriesState();

const isFactoryPersistedState = (
  value: unknown
): value is Partial<FactoryPersistedState> & { amount: number } =>
  typeof value === "object" &&
  value !== null &&
  "amount" in value &&
  typeof value.amount === "number";

const normalizeManualProductionFields = (
  state: FactoryPersistedState
): FactoryPersistedState => {
  if (!state.isProducing) {
    return {
      ...state,
      isProducing: false,
      productionStartedAt: null,
      productionDurationSec: null,
    };
  }

  if (
    state.productionStartedAt == null ||
    state.productionDurationSec == null
  ) {
    return {
      ...state,
      isProducing: false,
      productionStartedAt: null,
      productionDurationSec: null,
    };
  }

  return state;
};

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
      next[factory] = normalizeManualProductionFields({
        ...next[factory],
        ...saved,
        productionStartedAt: saved.productionStartedAt ?? null,
        productionDurationSec: saved.productionDurationSec ?? null,
      });
    }
  }

  return next;
};

export const factoriesAtom = persistedAtomWithNormalize<
  Record<FactoryType, FactoryPersistedState>
>(LOCAL_STORAGE.factories, initialData, normalizeFactoriesState);

export const useFactories = () => useAtomValue(factoriesAtom);
