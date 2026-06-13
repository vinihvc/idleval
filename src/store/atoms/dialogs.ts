import { atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import type { FactoryType } from "@/content/factories";
import { store } from "@/providers/store";
import {
  dismissNotification,
  type NotificationKey,
} from "@/store/atoms/notifications";

export const DIALOG_IDS = {
  about: "about",
  dailyReward: "daily-reward",
  debugWelcome: "debug-welcome",
  gods: "gods",
  inventory: "inventory",
  managers: "managers",
  offlineEarning: "offline-earning",
  settings: "settings",
  statistics: "statistics",
  upgrades: "upgrades",
  welcome: "welcome",
  wiki: "wiki",
} as const;

type StaticDialogId = (typeof DIALOG_IDS)[keyof typeof DIALOG_IDS];

export type DialogId = StaticDialogId | `factory:${FactoryType}`;

export const getFactoryDialogId = (
  factoryType: FactoryType
): Extract<DialogId, `factory:${FactoryType}`> => `factory:${factoryType}`;

export const DIALOG_PRIORITY: readonly DialogId[] = [
  DIALOG_IDS.welcome,
  DIALOG_IDS.offlineEarning,
  DIALOG_IDS.dailyReward,
] as const;

const DIALOG_NOTIFICATION_KEYS = {
  [DIALOG_IDS.dailyReward]: "daily",
  [DIALOG_IDS.gods]: "gods",
  [DIALOG_IDS.inventory]: "inventory",
  [DIALOG_IDS.managers]: "managers",
  [DIALOG_IDS.upgrades]: "upgrades",
} as const satisfies Partial<Record<DialogId, NotificationKey>>;

export const dialogsAtom = atom<DialogId | null>(null);

const createDialogOpenAtom = (id: DialogId) =>
  selectAtom(dialogsAtom, (openDialogId) => openDialogId === id);

const dialogOpenAtoms = new Map<
  DialogId,
  ReturnType<typeof createDialogOpenAtom>
>();

const getDialogOpenAtom = (id: DialogId) => {
  const cached = dialogOpenAtoms.get(id);

  if (cached) {
    return cached;
  }

  const dialogOpenAtom = createDialogOpenAtom(id);
  dialogOpenAtoms.set(id, dialogOpenAtom);

  return dialogOpenAtom;
};

export const useOpenDialogId = () => useAtomValue(dialogsAtom);

export const useDialogOpen = (id: DialogId) =>
  useAtomValue(getDialogOpenAtom(id));

export const getOpenDialogId = (): DialogId | null => store.get(dialogsAtom);

export const isDialogOpen = (id: DialogId): boolean => getOpenDialogId() === id;

const getDialogPriority = (id: DialogId): number | null => {
  const priority = DIALOG_PRIORITY.indexOf(id);

  return priority === -1 ? null : priority;
};

export const canOpenDialog = (
  nextDialogId: DialogId,
  currentDialogId: DialogId | null = getOpenDialogId()
): boolean => {
  if (currentDialogId === null || currentDialogId === nextDialogId) {
    return true;
  }

  const currentPriority = getDialogPriority(currentDialogId);

  if (currentPriority === null) {
    return true;
  }

  const nextPriority = getDialogPriority(nextDialogId);

  return nextPriority !== null && nextPriority < currentPriority;
};

const dismissDialogNotification = (id: DialogId) => {
  const notificationKey =
    DIALOG_NOTIFICATION_KEYS[id as keyof typeof DIALOG_NOTIFICATION_KEYS];

  if (notificationKey) {
    dismissNotification(notificationKey);
  }
};

export const openDialog = (id: DialogId) => {
  if (!canOpenDialog(id)) {
    return;
  }

  dismissDialogNotification(id);
  store.set(dialogsAtom, id);
};

export const closeCurrentDialog = () => {
  store.set(dialogsAtom, null);
};

export const closeDialog = (id: DialogId) => {
  store.set(dialogsAtom, (current) => (current === id ? null : current));
};

export const setDialogOpen = (id: DialogId, open: boolean) => {
  if (open) {
    openDialog(id);
    return;
  }

  closeDialog(id);
};

export const toggleDialog = (id: DialogId) => {
  store.set(dialogsAtom, (current) => {
    if (current === id) {
      return null;
    }

    if (!canOpenDialog(id, current)) {
      return current;
    }

    dismissDialogNotification(id);
    return id;
  });
};
