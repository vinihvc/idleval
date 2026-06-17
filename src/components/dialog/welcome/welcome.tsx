import { Image } from "@unpic/react";
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
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import {
  DIALOG_IDS,
  openDialog,
  setDialogOpen,
  useDialogOpen,
} from "@/store/atoms/dialogs";
import { useLocalStorage } from "./use-local-storage";
import { WelcomeActions } from "./welcome.actions";
import { WelcomeContent } from "./welcome.content";

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
        <Image
          alt={m["ui.welcome.imageAlt"]()}
          aria-hidden
          className={cn(
            "absolute -top-12 left-1/2 inline-flex -translate-x-1/2 sm:-top-18 md:left-2 md:translate-x-0",
            "pixel-crisp object-cover",
            "aspect-square size-22",
            "drop-shadow-lg",
            "pointer-events-none"
          )}
          height={112}
          layout="constrained"
          src="/images/characters/realm-seal.webp"
          width={112}
        />

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
