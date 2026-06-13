import { LOCAL_STORAGE } from "@/config/local-storage";
import { store } from "@/providers/store";
import { persistedAtom } from "@/store/storage";

export interface SessionState {
  lastSeenAt: number | null;
}

export const sessionAtom = persistedAtom<SessionState>(LOCAL_STORAGE.session, {
  lastSeenAt: null,
});

export const getLastSeenAt = (): number | null =>
  store.get(sessionAtom).lastSeenAt;

export const isDocumentVisible = (): boolean => {
  if (typeof document === "undefined") {
    return true;
  }

  return document.visibilityState === "visible";
};

export const touchLastSeen = (timestamp = Date.now()) => {
  store.set(sessionAtom, { lastSeenAt: timestamp });
};

export const touchLastSeenIfVisible = (timestamp = Date.now()) => {
  if (!isDocumentVisible()) {
    return;
  }

  touchLastSeen(timestamp);
};
