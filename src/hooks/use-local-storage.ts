import React from "react";

const dispatchStorageEvent = (key: string, newValue: string | null) => {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
};

const setLocalStorageItem = (key: string, value: unknown) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => window.localStorage.getItem(key);

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
};

const getServerSnapshot = () => {
  throw new Error("useLocalStorage is a client-only hook");
};

const parseStoredValue = <T>(raw: string | null, initialValue: T): T => {
  if (!raw) {
    return initialValue;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return initialValue;
  }
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setState = React.useCallback(
    (value: T | ((previous: T) => T)) => {
      try {
        const nextState =
          typeof value === "function"
            ? (value as (previous: T) => T)(
                parseStoredValue(store, initialValue)
              )
            : value;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [initialValue, key, store]
  );

  React.useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [initialValue, key]);

  return [parseStoredValue(store, initialValue), setState] as const;
};
