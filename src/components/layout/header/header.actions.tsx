import React from "react";

const LazySettingsDialog = React.lazy(
  () => import("@/components/dialog/settings/settings")
);

import { AmountToBuy } from "./header.amount";

export const HeaderActions = () => (
  <nav className="flex gap-2">
    <AmountToBuy />
    <React.Suspense fallback={null}>
      <LazySettingsDialog />
    </React.Suspense>
  </nav>
);
