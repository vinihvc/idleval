import { atom, useAtomValue } from "jotai";
import type { FactoryType } from "@/content/factories";
import { store } from "@/providers/store";
import { persistedAtom } from "@/store/storage";

export interface SessionState {
  lastSeenAt: number | null;
}

export const sessionAtom = persistedAtom<SessionState>("session", {
  lastSeenAt: null,
});

export const offlineCycleProgressAtom = atom<
  Partial<Record<FactoryType, number>>
>({});

export const useOfflineCycleProgress = () =>
  useAtomValue(offlineCycleProgressAtom);

export const getLastSeenAt = (): number | null =>
  store.get(sessionAtom).lastSeenAt;

export const touchLastSeen = (timestamp = Date.now()) => {
  store.set(sessionAtom, { lastSeenAt: timestamp });
};
