import React from "react";
import { VariantTools } from "@/components/debug/variant-tools";
import { LOCAL_STORAGE_KEYS } from "@/config/local-storage-keys";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { IS_DEV } from "@/lib/envs";

export const VARIANT_TOOLS = ["a", "b", "c", "d"] as const;

export type VariantToolsType = (typeof VARIANT_TOOLS)[number];

const DEFAULT_VARIANT: VariantToolsType = "d";

const isVariantTools = (value: string): value is VariantToolsType =>
  (VARIANT_TOOLS as readonly string[]).includes(value);

interface VariantToolsContextValue {
  setVariant: (variant: VariantToolsType) => void;
  variant: VariantToolsType;
}

const VariantToolsContext =
  React.createContext<VariantToolsContextValue | null>(null);

export const VariantToolsProvider = ({ children }: React.PropsWithChildren) => {
  const [storedVariant, setStoredVariant] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.inventoryCardVariant,
    DEFAULT_VARIANT
  );
  const variant = isVariantTools(storedVariant)
    ? storedVariant
    : DEFAULT_VARIANT;

  const setVariant = React.useCallback(
    (next: VariantToolsType) => {
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

      <VariantTools />
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

export const useIsVariantTools = (target: VariantToolsType) =>
  useVariantTools().variant === target;

export const usePickVariantTools = <T,>(options: Record<VariantToolsType, T>) =>
  options[useVariantTools().variant];
