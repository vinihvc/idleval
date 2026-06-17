import { useLocalStorage as useLocalStorageBase } from "@/hooks/use-local-storage";

const ensureJsonStoredValue = (
  key: string,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage
) => {
  const raw = storage.getItem(key);

  if (raw === null) {
    return;
  }

  try {
    JSON.parse(raw);
  } catch {
    storage.setItem(key, JSON.stringify(raw));
  }
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  ensureJsonStoredValue(key);

  return useLocalStorageBase<T>(key, initialValue);
};
