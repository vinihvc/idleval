import React from "react";

const LazyUpgradesDialog = React.lazy(
  () => import("@/components/dialog/upgrades/upgrades")
);

const LazyManagersDialog = React.lazy(
  () => import("@/components/dialog/managers/managers")
);

const LazyGodsDialog = React.lazy(
  () => import("@/components/dialog/gods/gods")
);

const LazyInventoryDialog = React.lazy(
  () => import("@/components/dialog/inventory/inventory")
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
