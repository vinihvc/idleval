import { SettingsDialog } from "@/components/dialog/settings";
import { AmountToBuy } from "./header.amount";

export const HeaderActions = () => (
  <nav className="flex gap-2">
    <AmountToBuy />
    <SettingsDialog />
  </nav>
);
