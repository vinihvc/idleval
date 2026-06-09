import { ArrowUpBox } from "pixelarticons/react/ArrowUpBox";
import { Backpack } from "pixelarticons/react/Backpack";
import { Briefcase } from "pixelarticons/react/Briefcase";
import { Crown } from "pixelarticons/react/Crown";
import React from "react";
import { Button } from "@/components/ui/button";
import { Float } from "@/components/ui/float";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { Status } from "@/components/ui/status";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { useNotifications } from "@/store/atoms/notifications";

const LazyUpgradesDialog = React.lazy(
  () => import("@/components/dialog/upgrades/upgrades")
);

const LazyManagersDialog = React.lazy(
  () => import("@/components/dialog/managers/managers")
);

const LazyGodsDialog = React.lazy(
  () => import("@/components/dialog/gods/gods")
);

const LazyInventoryDialog = React.lazy(
  () => import("@/components/dialog/inventory/inventory")
);

export const HeaderNavigation = (props: React.ComponentProps<"nav">) => {
  const { className, ...rest } = props;

  const notifications = useNotifications();

  return (
    <nav
      aria-label={m["ui.nav.gameSections"]()}
      className={cn("hidden items-center gap-2 sm:flex", className)}
      {...rest}
    >
      <React.Suspense fallback={null}>
        <LazyUpgradesDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <ResponsiveDialogTrigger asChild>
                <Button size="icon-md" variant="cream">
                  <span className="sr-only">{m["ui.nav.upgrades"]()}</span>
                  <ArrowUpBox />
                  {notifications.upgrades && (
                    <Float>
                      <Status variant="success" />
                    </Float>
                  )}
                </Button>
              </ResponsiveDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{m["ui.nav.upgrades"]()}</TooltipContent>
          </Tooltip>
        </LazyUpgradesDialog>
      </React.Suspense>
      <React.Suspense fallback={null}>
        <LazyManagersDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <ResponsiveDialogTrigger asChild>
                <Button size="icon-md" variant="cream">
                  <span className="sr-only">{m["ui.nav.managers"]()}</span>
                  <Briefcase />
                  {notifications.managers && (
                    <Float>
                      <Status variant="success" />
                    </Float>
                  )}
                </Button>
              </ResponsiveDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{m["ui.nav.managers"]()}</TooltipContent>
          </Tooltip>
        </LazyManagersDialog>
      </React.Suspense>
      <React.Suspense fallback={null}>
        <LazyGodsDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <ResponsiveDialogTrigger asChild>
                <Button size="icon-md" variant="cream">
                  <span className="sr-only">{m["ui.nav.gods"]()}</span>
                  <Crown />
                  {notifications.gods && (
                    <Float>
                      <Status variant="success" />
                    </Float>
                  )}
                </Button>
              </ResponsiveDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{m["ui.nav.gods"]()}</TooltipContent>
          </Tooltip>
        </LazyGodsDialog>
      </React.Suspense>
      <React.Suspense fallback={null}>
        <LazyInventoryDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <ResponsiveDialogTrigger asChild>
                <Button size="icon-md" variant="cream">
                  <span className="sr-only">{m["ui.nav.inventory"]()}</span>
                  <Backpack />
                  {notifications.inventory && (
                    <Float>
                      <Status variant="success" />
                    </Float>
                  )}
                </Button>
              </ResponsiveDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{m["ui.nav.inventory"]()}</TooltipContent>
          </Tooltip>
        </LazyInventoryDialog>
      </React.Suspense>
    </nav>
  );
};
