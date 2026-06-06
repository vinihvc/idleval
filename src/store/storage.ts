import { atomWithStorage, createJSONStorage } from "jotai/utils";

const canUseLocalStorage = (): boolean => {
  try {
    return (
      typeof localStorage !== "undefined" &&
      typeof localStorage.getItem === "function"
    );
  } catch {
    return false;
  }
};

const memoryStorage = new Map<string, string>();

const fallbackStorage: Storage = {
  get length() {
    return memoryStorage.size;
  },
  clear() {
    memoryStorage.clear();
  },
  getItem(key: string) {
    return memoryStorage.get(key) ?? null;
  },
  key(index: number) {
    return [...memoryStorage.keys()][index] ?? null;
  },
  removeItem(key: string) {
    memoryStorage.delete(key);
  },
  setItem(key: string, value: string) {
    memoryStorage.set(key, value);
  },
};

const getStorage = () =>
  canUseLocalStorage() ? localStorage : fallbackStorage;

export const persistedAtom = <Value>(key: string, initialValue: Value) =>
  atomWithStorage<Value>(
    key,
    initialValue,
    createJSONStorage<Value>(getStorage),
    {
      getOnInit: canUseLocalStorage(),
    }
  );
