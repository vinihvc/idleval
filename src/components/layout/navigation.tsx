import { ArrowUpBox, Briefcase, Crown } from "pixelarticons/react";
import type React from "react";
import { GodsDialog } from "@/components/dialog/gods/gods";
import { ManagersDialog } from "@/components/dialog/managers/managers";
import { UpgradesDialog } from "@/components/dialog/upgrades/upgrades";
import { DialogNavItem } from "@/components/layout/dialog-nav-item";
import {
  BottomNavigationItem,
  BottomNavigationItemIcon,
  BottomNavigationList,
  BottomNavigation as BottomNavigationRoot,
} from "@/components/ui/bottom-navigation";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
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
          "z-60",
          "border-primary bg-secondary/95 backdrop-blur-lg",
          "**:data-[slot=bottom-navigation-item]:border-transparent **:data-[slot=bottom-navigation-item]:bg-transparent **:data-[slot=bottom-navigation-item]:text-foreground/70 **:data-[slot=bottom-navigation-item]:shadow-none",
          "**:data-[slot=bottom-navigation-item]:aria-selected:text-primary **:data-[slot=bottom-navigation-item]:hover:text-primary"
        )}
      >
        <UpgradesDialog>
          <BottomNavigationItem asChild value="upgrades">
            <ResponsiveDialogTrigger asChild>
              <button
                className="flex size-full flex-col items-center justify-center"
                type="button"
              >
                <BottomNavigationItemIcon>
                  <ArrowUpBox />
                </BottomNavigationItemIcon>
                <span className="sr-only">Upgrades</span>
              </button>
            </ResponsiveDialogTrigger>
          </BottomNavigationItem>
        </UpgradesDialog>

        <ManagersDialog>
          <BottomNavigationItem asChild value="managers">
            <ResponsiveDialogTrigger asChild>
              <button
                className="flex size-full flex-col items-center justify-center"
                type="button"
              >
                <BottomNavigationItemIcon>
                  <Briefcase />
                </BottomNavigationItemIcon>
                <span className="sr-only">Managers</span>
              </button>
            </ResponsiveDialogTrigger>
          </BottomNavigationItem>
        </ManagersDialog>

        <GodsDialog>
          <BottomNavigationItem asChild value="gods">
            <ResponsiveDialogTrigger asChild>
              <button
                className="flex size-full flex-col items-center justify-center"
                type="button"
              >
                <BottomNavigationItemIcon>
                  <Crown />
                </BottomNavigationItemIcon>
                <span className="sr-only">Gods</span>
              </button>
            </ResponsiveDialogTrigger>
          </BottomNavigationItem>
        </GodsDialog>
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
    </nav>
  );
};
