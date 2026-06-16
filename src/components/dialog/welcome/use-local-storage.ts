import { useLocalStorage as useUsehooksLocalStorage } from "@uidotdev/usehooks";

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

  return useUsehooksLocalStorage<T>(key, initialValue);
};
