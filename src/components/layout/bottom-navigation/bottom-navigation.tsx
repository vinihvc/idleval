import type React from "react";
import { AllianceDialog } from "@/components/dialog/alliances";
import { ManagersDialog } from "@/components/dialog/managers/managers";
import { StatisticsDialog } from "@/components/dialog/statistics";
import { UpgradesDialog } from "@/components/dialog/upgrades/upgrades";
import {
  BottomNavigationList,
  BottomNavigation as BottomNavigationRoot,
} from "@/components/ui/bottom-navigation";
import { cn } from "@/lib/cn";

interface BottomNavigationProps
  extends React.ComponentProps<typeof BottomNavigationRoot> {}

export const BottomNavigation = (props: BottomNavigationProps) => {
  const { className, ...rest } = props;

  return (
    <BottomNavigationRoot className={cn("sm:hidden", className)} {...rest}>
      <BottomNavigationList
        aria-label="Game navigation"
        className={cn(
          "border-background/20 bg-foreground/80 backdrop-blur-lg",
          "**:data-[slot=bottom-navigation-item]:border-transparent **:data-[slot=bottom-navigation-item]:bg-transparent **:data-[slot=bottom-navigation-item]:text-background **:data-[slot=bottom-navigation-item]:shadow-none",
          "**:data-[slot=bottom-navigation-item]:hover:bg-transparent **:data-[slot=bottom-navigation-item]:aria-selected:text-background"
        )}
      >
        <UpgradesDialog variant="bottom" />

        <ManagersDialog variant="bottom" />

        <AllianceDialog variant="bottom" />

        <StatisticsDialog variant="bottom" />
      </BottomNavigationList>
    </BottomNavigationRoot>
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
      <UpgradesDialog variant="header" />

      <ManagersDialog variant="header" />

      <AllianceDialog variant="header" />

      <StatisticsDialog variant="header" />
    </nav>
  );
};
