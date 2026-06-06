import type React from "react";
import { BottomNavigationItemIcon } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DialogNavItemProps {
  dialog: React.ComponentType<React.PropsWithChildren>;
  icon: React.ReactNode;
  label: string;
  variant?: "bottom" | "header";
}

export const DialogNavItem = (props: DialogNavItemProps) => {
  const { dialog: Dialog, icon, label, variant = "header" } = props;

  if (variant === "bottom") {
    return (
      <Dialog>
        <ResponsiveDialogTrigger asChild>
          <button
            className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg:not([class*='size-'])]:size-6 [&_svg]:pointer-events-none [&_svg]:shrink-0"
            type="button"
          >
            <BottomNavigationItemIcon>{icon}</BottomNavigationItemIcon>
            <span className="sr-only">{label}</span>
          </button>
        </ResponsiveDialogTrigger>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button size="icon-md" variant="cream">
              <span className="sr-only">{label}</span>
              {icon}
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </Dialog>
  );
};
