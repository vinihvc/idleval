import React from "react";

const LazyUpgradesDialog = React.lazy(() =>
  import("@/components/dialog/upgrades/upgrades").then((module) => ({
    default: module.UpgradesDialog,
  }))
);

const LazyManagersDialog = React.lazy(() =>
  import("@/components/dialog/managers/managers").then((module) => ({
    default: module.ManagersDialog,
  }))
);

const LazyGodsDialog = React.lazy(() =>
  import("@/components/dialog/gods/gods").then((module) => ({
    default: module.GodsDialog,
  }))
);

const LazyInventoryDialog = React.lazy(() =>
  import("@/components/dialog/inventory/inventory").then((module) => ({
    default: module.InventoryDialog,
  }))
);

export const GameSectionDialogs = () => (
  <>
    <React.Suspense fallback={null}>
      <LazyUpgradesDialog />
    </React.Suspense>

    <React.Suspense fallback={null}>
      <LazyManagersDialog />
    </React.Suspense>

    <React.Suspense fallback={null}>
      <LazyGodsDialog />
    </React.Suspense>

    <React.Suspense fallback={null}>
      <LazyInventoryDialog />
    </React.Suspense>
  </>
);
