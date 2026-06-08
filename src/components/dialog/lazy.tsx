import { lazy } from "react";

export const LazyWelcomeDialog = lazy(() =>
  import("./welcome/welcome").then((m) => ({ default: m.WelcomeDialog }))
);

export const LazySettingsDialog = lazy(() =>
  import("./settings/settings").then((m) => ({ default: m.SettingsDialog }))
);

export const LazyAboutDialog = lazy(() =>
  import("./about/about").then((m) => ({ default: m.AboutDialog }))
);

export const LazyStatisticsDialog = lazy(() =>
  import("./statistics/statistics").then((m) => ({
    default: m.StatisticsDialog,
  }))
);

export const LazyGodsDialog = lazy(() =>
  import("./gods/gods").then((m) => ({ default: m.GodsDialog }))
);

export const LazyManagersDialog = lazy(() =>
  import("./managers/managers").then((m) => ({ default: m.ManagersDialog }))
);

export const LazyUpgradesDialog = lazy(() =>
  import("./upgrades/upgrades").then((m) => ({ default: m.UpgradesDialog }))
);

export const LazyFactoryDialog = lazy(() =>
  import("./factory/factory").then((m) => ({ default: m.FactoryDialog }))
);

export const LazyOfflineEarningsDialog = lazy(() =>
  import("./offline-earnings/offline-earnings").then((m) => ({
    default: m.OfflineEarningsDialog,
  }))
);
