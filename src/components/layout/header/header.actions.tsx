import { Suspense } from "react";
import { LazySettingsDialog } from "@/components/dialog/lazy";
import { AmountToBuy } from "./header.amount";

export const HeaderActions = () => (
  <nav className="flex gap-2">
    <AmountToBuy />
    <Suspense fallback={null}>
      <LazySettingsDialog />
    </Suspense>
  </nav>
);
