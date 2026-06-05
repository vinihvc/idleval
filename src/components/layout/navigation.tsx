import { ArrowUpBox, Briefcase, Chart, Crown } from "pixelarticons/react";
import type React from "react";
import { GodsDialog } from "@/components/dialog/gods/gods";
import { ManagersDialog } from "@/components/dialog/managers/managers";
import { StatisticsDialog } from "@/components/dialog/statistics";
import { UpgradesDialog } from "@/components/dialog/upgrades/upgrades";
import {
  BottomNavigationItem,
  BottomNavigationItemIcon,
  BottomNavigationList,
  BottomNavigation as BottomNavigationRoot,
} from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          "border-primary/40 bg-secondary/95 backdrop-blur-lg",
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

        <StatisticsDialog>
          <BottomNavigationItem asChild value="statistics">
            <ResponsiveDialogTrigger asChild>
              <button
                className="flex size-full flex-col items-center justify-center"
                type="button"
              >
                <BottomNavigationItemIcon>
                  <Chart />
                </BottomNavigationItemIcon>
                <span className="sr-only">Statistics</span>
              </button>
            </ResponsiveDialogTrigger>
          </BottomNavigationItem>
        </StatisticsDialog>
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
      <UpgradesDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button size="icon-md" variant="cream">
                <span className="sr-only">Upgrades</span>
                <ArrowUpBox />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Upgrades</TooltipContent>
        </Tooltip>
      </UpgradesDialog>

      <ManagersDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button size="icon-md" variant="cream">
                <span className="sr-only">Managers</span>
                <Briefcase />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Managers</TooltipContent>
        </Tooltip>
      </ManagersDialog>

      <GodsDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button size="icon-md" variant="cream">
                <span className="sr-only">Gods</span>
                <Crown />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Gods</TooltipContent>
        </Tooltip>
      </GodsDialog>

      <StatisticsDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <ResponsiveDialogTrigger asChild>
              <Button size="icon-md" variant="cream">
                <span className="sr-only">Statistics</span>
                <Chart />
              </Button>
            </ResponsiveDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Statistics</TooltipContent>
        </Tooltip>
      </StatisticsDialog>
    </nav>
  );
};
