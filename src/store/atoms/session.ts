import { atom } from "jotai";
import { persistedAtom } from "@/store/storage";
import type { FactoryType } from "@/content/factories";
import { store } from "@/providers/store";

export interface SessionState {
  lastSeenAt: number | null;
}

export const sessionAtom = persistedAtom<SessionState>("session", {
  lastSeenAt: null,
});

export const offlineCycleProgressAtom = atom<
  Partial<Record<FactoryType, number>>
>({});

export const getLastSeenAt = (): number | null =>
  store.get(sessionAtom).lastSeenAt;

export const touchLastSeen = (timestamp = Date.now()) => {
  store.set(sessionAtom, { lastSeenAt: timestamp });
};
