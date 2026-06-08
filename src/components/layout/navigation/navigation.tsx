import { ArrowUpBox, Briefcase, Crown } from "pixelarticons/react";
import type React from "react";
import { GodsDialog } from "@/components/dialog/gods/gods";
import { ManagersDialog } from "@/components/dialog/managers/managers";
import { UpgradesDialog } from "@/components/dialog/upgrades/upgrades";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationItemIcon,
  BottomNavigationList,
} from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";

interface NavigationProps
  extends React.ComponentProps<typeof BottomNavigation> {}

export const Navigation = (props: NavigationProps) => {
  const { className, ...rest } = props;

  return (
    <BottomNavigation
      className={cn("z-100 shrink-0 sm:hidden", className)}
      {...rest}
    >
      <BottomNavigationList
        aria-label={m["ui.nav.label"]()}
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
                <span className="sr-only">{m["ui.nav.upgrades"]()}</span>
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
                <span className="sr-only">{m["ui.nav.managers"]()}</span>
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
                <span className="sr-only">{m["ui.nav.gods"]()}</span>
              </button>
            </ResponsiveDialogTrigger>
          </BottomNavigationItem>
        </GodsDialog>
      </BottomNavigationList>
    </BottomNavigation>
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
      <UpgradesDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button size="icon-md" variant="cream">
                <span className="sr-only">{m["ui.nav.upgrades"]()}</span>
                <ArrowUpBox />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{m["ui.nav.upgrades"]()}</TooltipContent>
        </Tooltip>
      </UpgradesDialog>
      <ManagersDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button size="icon-md" variant="cream">
                <span className="sr-only">{m["ui.nav.managers"]()}</span>
                <Briefcase />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{m["ui.nav.managers"]()}</TooltipContent>
        </Tooltip>
      </ManagersDialog>
      <GodsDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button size="icon-md" variant="cream">
                <span className="sr-only">{m["ui.nav.gods"]()}</span>
                <Crown />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{m["ui.nav.gods"]()}</TooltipContent>
        </Tooltip>
      </GodsDialog>
    </nav>
  );
};
