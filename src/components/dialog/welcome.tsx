import { Image } from "@unpic/react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { cn } from "@/lib/cn";

const WELCOME_DIALOG_STORAGE_KEY = "idleval:welcome-dialog-seen:v1";

export const WelcomeDialog = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const hasSeenWelcome =
      window.localStorage.getItem(WELCOME_DIALOG_STORAGE_KEY) === "true";

    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      window.localStorage.setItem(WELCOME_DIALOG_STORAGE_KEY, "true");
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
          aria-hidden
          className={cn(
            "absolute -top-12 left-1/2 inline-flex max-md:-translate-x-1/2 sm:-top-18 md:left-2",
            "pixel-crisp object-cover",
            "aspect-square size-22 sm:size-28",
            "drop-shadow-lg",
            "pointer-events-none"
          )}
          height={112}
          layout="constrained"
          src="/images/msc/welcome.webp"
          width={112}
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Welcome to Idleval</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Raise a tiny realm, hire strange helpers, court impossible powers,
            and watch your coffers grow while you are away.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-4 text-popover-foreground/90 leading-relaxed">
            <p>
              Idleval is a fantasy parody. No god, ruler, guild, manager, saint,
              monster, personality, or cosmic accountant in this game is meant
              to be taken seriously or treated as a real-world statement.
            </p>
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="lg" variant="default">
              Begin the realm
            </Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
