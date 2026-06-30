import { LOCAL_STORAGE } from "@/config/local-storage";
import { store } from "@/providers/store";
import { persistedAtomWithNormalize } from "@/store/storage";

export interface SessionState {
  lastSeenAt: number | null;
}

const defaultSessionState = (): SessionState => ({
  lastSeenAt: null,
});

export const normalizeSessionState = (value: unknown): SessionState => {
  if (typeof value !== "object" || value === null) {
    return defaultSessionState();
  }

  const raw = value as Record<string, unknown>;
  const lastSeenAt =
    typeof raw.lastSeenAt === "number" && Number.isFinite(raw.lastSeenAt)
      ? raw.lastSeenAt
      : null;

  return { lastSeenAt };
};

export const sessionAtom = persistedAtomWithNormalize<SessionState>(
  LOCAL_STORAGE.session,
  defaultSessionState(),
  normalizeSessionState
);

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
