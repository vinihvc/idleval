import { Button } from "@/components/ui/button";
import { ResponsiveDialogClose } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";

export const OfflineEarningActions = () => (
  <ResponsiveDialogClose asChild>
    <Button className="w-full" variant="default">
      {m["ui.offline.claimContinue"]()}
    </Button>
  </ResponsiveDialogClose>
);
