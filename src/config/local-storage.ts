export const LOCAL_STORAGE = {
  welcomeDialogSeen: "idleval:welcome-dialog-seen",
  wallet: "wallet",
  session: "session",
  settings: "settings",
  purchaseMode: "msc",
  inventory: "inventory",
  factories: "factorie",
  gods: "god",
  statistics: "statistics",
  notifications: "notifications",
} as const;

export type LocalStorageKey =
  (typeof LOCAL_STORAGE)[keyof typeof LOCAL_STORAGE];
