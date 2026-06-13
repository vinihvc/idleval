import React from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { LOCAL_STORAGE } from "@/config/local-storage";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { m } from "@/i18n/messages";
import {
  DIALOG_IDS,
  openDialog,
  setDialogOpen,
  useDialogOpen,
} from "@/store/atoms/dialogs";
import { WelcomeActions } from "./welcome.actions";
import { WelcomeContent } from "./welcome.content";
import { WelcomeGraphic } from "./welcome.graphic";

interface WelcomeDialogProps {
  debug?: boolean;
}

export const WelcomeDialog = (props: WelcomeDialogProps = {}) => {
  const { debug = false } = props;
  const dialogId = debug ? DIALOG_IDS.debugWelcome : DIALOG_IDS.welcome;
  const open = useDialogOpen(dialogId);
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage(
    LOCAL_STORAGE.welcomeDialogSeen,
    false
  );
  const wasOpenRef = React.useRef(open);

  React.useEffect(() => {
    if (debug || hasSeenWelcome) {
      return;
    }

    openDialog(DIALOG_IDS.welcome);
  }, [debug, hasSeenWelcome]);

  React.useEffect(() => {
    if (wasOpenRef.current && !open && debug === false) {
      setHasSeenWelcome(true);
    }

    wasOpenRef.current = open;
  }, [debug, open, setHasSeenWelcome]);

  const handleOpenChange = (nextOpen: boolean) => {
    setDialogOpen(dialogId, nextOpen);

    if (nextOpen === false && debug === false) {
      setHasSeenWelcome(true);
    }
  };

  return (
    <ResponsiveDialog
      onOpenChange={handleOpenChange}
      open={open}
      role="alertdialog"
    >
      <ResponsiveDialogContent showCloseButton={false}>
        <WelcomeGraphic />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.welcome.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.welcome.subtitle"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <WelcomeContent />
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <WelcomeActions />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default WelcomeDialog;
