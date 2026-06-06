import { ArrowUpBox, Briefcase, Chart, Crown } from "pixelarticons/react";
import type React from "react";
import { GodsDialog } from "@/components/dialog/gods/gods";
import { ManagersDialog } from "@/components/dialog/managers/managers";
import { StatisticsDialog } from "@/components/dialog/statistics";
import { UpgradesDialog } from "@/components/dialog/upgrades/upgrades";
import { DialogNavItem } from "@/components/layout/dialog-nav-item";
import { cn } from "@/lib/cn";

interface BottomNavigationProps extends React.ComponentProps<"nav"> {}

export const BottomNavigation = (props: BottomNavigationProps) => {
  const { className, ...rest } = props;

  return (
    <nav
      aria-label="Game navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-10 sm:hidden",
        "flex min-h-14 w-full items-center justify-around",
        "border-primary/40 border-t-2 bg-secondary/95 backdrop-blur-lg",
        "pb-[env(safe-area-inset-bottom,0px)]",
        className
      )}
      {...rest}
    >
      <DialogNavItem
        dialog={UpgradesDialog}
        icon={<ArrowUpBox />}
        label="Upgrades"
        variant="bottom"
      />
      <DialogNavItem
        dialog={ManagersDialog}
        icon={<Briefcase />}
        label="Managers"
        variant="bottom"
      />
      <DialogNavItem
        dialog={GodsDialog}
        icon={<Crown />}
        label="Gods"
        variant="bottom"
      />
      <DialogNavItem
        dialog={StatisticsDialog}
        icon={<Chart />}
        label="Statistics"
        variant="bottom"
      />
    </nav>
  );
};

interface HeaderNavigationProps extends React.ComponentProps<"nav"> {}

export const HeaderNavigation = (props: HeaderNavigationProps) => {
  const { className, ...rest } = props;

  return (
    <nav
      className={cn("flex items-center gap-2 max-sm:hidden", className)}
      {...rest}
    >
      <DialogNavItem
        dialog={UpgradesDialog}
        icon={<ArrowUpBox />}
        label="Upgrades"
      />
      <DialogNavItem
        dialog={ManagersDialog}
        icon={<Briefcase />}
        label="Managers"
      />
      <DialogNavItem dialog={GodsDialog} icon={<Crown />} label="Gods" />
      <DialogNavItem
        dialog={StatisticsDialog}
        icon={<Chart />}
        label="Statistics"
      />
    </nav>
  );
};
