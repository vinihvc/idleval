export const LOCAL_STORAGE_KEYS = {
  welcomeDialogSeen: "idleval:welcome-dialog-seen:v1",
  inventoryCardVariant: "idleval.inventory-card-variant",
  wallet: "wallet-v4",
  session: "session",
  settings: "settings",
  purchaseMode: "msc",
  inventory: "inventory-v4",
  factories: "factories-v2",
  gods: "gods-v2",
  statistics: "statistics-v2",
  notifications: "notifications-v1",
} as const;

export type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
