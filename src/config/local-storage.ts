export const LOCAL_STORAGE = {
  welcomeDialogSeen: "idleval:welcome-dialog-seen",
  wallet: "wallet",
  session: "session",
  settings: "settings",
  purchaseMode: "msc",
  inventory: "inventory",
  dailyReward: "daily-reward",
  factories: "factorie",
  gods: "god",
  statistics: "statistics",
  notifications: "notifications",
  missions: "missions",
} as const;

export type LocalStorageKey =
  (typeof LOCAL_STORAGE)[keyof typeof LOCAL_STORAGE];
