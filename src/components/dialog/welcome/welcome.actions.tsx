import { Button } from "@/components/ui/button";
import { ResponsiveDialogClose } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";

export const WelcomeActions = () => (
  <ResponsiveDialogClose asChild>
    <Button size="lg" variant="default">
      {m["ui.welcome.begin"]()}
    </Button>
  </ResponsiveDialogClose>
);
