import { useLocalStorage } from "@/hooks/use-local-storage";
import React from "react";
import { LOCAL_STORAGE_KEYS } from "@/config/local-storage-keys";
import { IS_DEV } from "@/lib/envs";

export const VARIANT_TOOLS = ["a", "b", "c", "d"] as const;

export type VariantTools = (typeof VARIANT_TOOLS)[number];

const DEFAULT_VARIANT: VariantTools = "d";

const isVariantTools = (value: string): value is VariantTools =>
  (VARIANT_TOOLS as readonly string[]).includes(value);

interface VariantToolsContextValue {
  setVariant: (variant: VariantTools) => void;
  variant: VariantTools;
}

const VariantToolsContext =
  React.createContext<VariantToolsContextValue | null>(null);

export const VariantToolsProvider = ({ children }: React.PropsWithChildren) => {
  const [storedVariant, setStoredVariant] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.openCardVariant,
    DEFAULT_VARIANT
  );
  const variant = isVariantTools(storedVariant)
    ? storedVariant
    : DEFAULT_VARIANT;

  const setVariant = React.useCallback(
    (next: VariantTools) => {
      setStoredVariant(next);
    },
    [setStoredVariant]
  );

  React.useEffect(() => {
    if (!IS_DEV) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      const next = VARIANT_TOOLS[Number(event.key) - 1];

      if (next) {
        setVariant(next);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [setVariant]);

  const value = React.useMemo(
    () => ({ setVariant, variant }),
    [setVariant, variant]
  );

  return (
    <VariantToolsContext.Provider value={value}>
      {children}
    </VariantToolsContext.Provider>
  );
};

export const useVariantTools = () => {
  const context = React.useContext(VariantToolsContext);

  if (!context) {
    throw new Error("useVariantTools must be used within VariantToolsProvider");
  }

  return context;
};

export const useIsVariantTools = (target: VariantTools) =>
  useVariantTools().variant === target;

export const usePickVariantTools = <T,>(options: Record<VariantTools, T>) =>
  options[useVariantTools().variant];
