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

export const getStorage = () =>
  canUseLocalStorage() ? localStorage : fallbackStorage;

export const getStorageInitOptions = () => ({
  getOnInit: canUseLocalStorage(),
});

export const persistedAtom = <Value>(key: string, initialValue: Value) =>
  atomWithStorage<Value>(
    key,
    initialValue,
    createJSONStorage<Value>(getStorage),
    getStorageInitOptions()
  );

export const createNormalizedJsonStorage = <T>(
  normalize: (value: unknown) => T
) =>
  createJSONStorage<T>(() => {
    const storage = getStorage();

    return {
      getItem: (key) => {
        const value = storage.getItem(key);

        if (!value) {
          return null;
        }

        try {
          return JSON.stringify(normalize(JSON.parse(value)));
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        storage.setItem(key, value);
      },
      removeItem: (key) => {
        storage.removeItem(key);
      },
    };
  });

export const persistedAtomWithNormalize = <T>(
  key: string,
  initialValue: T,
  normalize: (value: unknown) => T
) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createNormalizedJsonStorage(normalize),
    getStorageInitOptions()
  );

export const createNormalizedJsonStorageWithLegacyFallback = <T>(
  normalize: (value: unknown) => T,
  readLegacy: () => unknown
) =>
  createJSONStorage<T>(() => {
    const storage = getStorage();

    return {
      getItem: (key) => {
        let value = storage.getItem(key);

        if (!value) {
          const legacy = readLegacy();

          if (legacy !== null) {
            const normalized = normalize(legacy);
            value = JSON.stringify(normalized);
            storage.setItem(key, value);
          }
        }

        if (!value) {
          return null;
        }

        try {
          return JSON.stringify(normalize(JSON.parse(value)));
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        storage.setItem(key, value);
      },
      removeItem: (key) => {
        storage.removeItem(key);
      },
    };
  });

export const persistedAtomWithNormalizeAndLegacy = <T>(
  key: string,
  initialValue: T,
  normalize: (value: unknown) => T,
  readLegacy: () => unknown
) =>
  atomWithStorage<T>(
    key,
    initialValue,
    createNormalizedJsonStorageWithLegacyFallback(normalize, readLegacy),
    getStorageInitOptions()
  );
