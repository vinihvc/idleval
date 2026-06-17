import React from "react";

const subscribe = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);

  return () => {
    document.removeEventListener("visibilitychange", callback);
  };
};

const getSnapshot = () => document.visibilityState;

const getServerSnapshot = () => {
  throw new Error("useVisibilityChange is a client-only hook");
};

export const useVisibilityChange = (): boolean =>
  React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) ===
  "visible";
