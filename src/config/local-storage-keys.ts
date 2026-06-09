export const LOCAL_STORAGE_KEYS = {
  welcomeDialogSeen: "idleval:welcome-dialog-seen:v1",
  openCardVariant: "idleval.open-card-variant",
  wallet: "wallet-v4",
  session: "session",
  settings: "settings",
  purchaseMode: "msc",
  inventory: "inventory-v2",
  factories: "factories",
  gods: "gods",
  statistics: "statistics",
  notifications: "notifications-v1",
} as const;

export type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
