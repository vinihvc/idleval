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
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

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
    <ResponsiveDialog onOpenChange={handleOpenChange} open={open}>
      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt="A young realm of farms, guilds, and coin"
          src="/images/msc/welcome.webp"
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Welcome to IdleVal</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Raise a tiny realm, hire strange helpers, court impossible powers,
            and watch your coffers grow while you are away.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-4 text-popover-foreground/90 leading-relaxed">
            <p>
              In this valley, wheat becomes tribute, tribute becomes workshops,
              and workshops become a kingdom held together by ambition,
              bookkeeping, and a suspicious amount of divine paperwork.
            </p>

            <p>
              IdleVal is a fantasy parody. No god, ruler, guild, manager, saint,
              monster, personality, or cosmic accountant in this game is meant
              to be taken seriously or treated as a real-world statement.
            </p>

            <p>
              The lore is simple: the old realm ran out of patience before it
              ran out of gold. Your job is to rebuild it one field, forge, and
              questionable blessing at a time.
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
