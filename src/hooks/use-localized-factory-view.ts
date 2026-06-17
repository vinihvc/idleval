import type { FactoryType } from "@/content/factories";
import { useLocalizedFactory } from "@/i18n/hooks/use-localized-factory";
import { useFactory } from "@/store/atoms/factories";

/**
 * Composes numeric factory state from the store with localized catalog strings.
 */
export const useLocalizedFactoryView = (factory: FactoryType) => {
  const factoryState = useFactory(factory);
  const localized = useLocalizedFactory(factory);

  return {
    ...factoryState,
    ...localized,
  };
};
