import { ArrowUpBox } from "pixelarticons/react/ArrowUpBox";
import { Backpack } from "pixelarticons/react/Backpack";
import { Briefcase } from "pixelarticons/react/Briefcase";
import { Crown } from "pixelarticons/react/Crown";
import React from "react";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationItemIcon,
  BottomNavigationList,
  BottomNavigationListItem,
} from "@/components/ui/bottom-navigation";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";

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

export const Navigation = (
  props: React.ComponentProps<typeof BottomNavigation>
) => {
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
          "border-primary bg-secondary/95 backdrop-blur-lg"
        )}
      >
        <React.Suspense fallback={null}>
          <LazyUpgradesDialog>
            <BottomNavigationListItem>
              <ResponsiveDialogTrigger asChild>
                <BottomNavigationItem>
                  <BottomNavigationItemIcon>
                    <ArrowUpBox />
                  </BottomNavigationItemIcon>
                  <span className="sr-only">{m["ui.nav.upgrades"]()}</span>
                </BottomNavigationItem>
              </ResponsiveDialogTrigger>
            </BottomNavigationListItem>
          </LazyUpgradesDialog>
        </React.Suspense>

        <React.Suspense fallback={null}>
          <LazyManagersDialog>
            <BottomNavigationListItem>
              <ResponsiveDialogTrigger asChild>
                <BottomNavigationItem>
                  <BottomNavigationItemIcon>
                    <Briefcase />
                  </BottomNavigationItemIcon>
                  <span className="sr-only">{m["ui.nav.managers"]()}</span>
                </BottomNavigationItem>
              </ResponsiveDialogTrigger>
            </BottomNavigationListItem>
          </LazyManagersDialog>
        </React.Suspense>

        <React.Suspense fallback={null}>
          <LazyGodsDialog>
            <BottomNavigationListItem>
              <ResponsiveDialogTrigger asChild>
                <BottomNavigationItem>
                  <BottomNavigationItemIcon>
                    <Crown />
                  </BottomNavigationItemIcon>
                  <span className="sr-only">{m["ui.nav.gods"]()}</span>
                </BottomNavigationItem>
              </ResponsiveDialogTrigger>
            </BottomNavigationListItem>
          </LazyGodsDialog>
        </React.Suspense>

        <React.Suspense fallback={null}>
          <LazyInventoryDialog>
            <BottomNavigationListItem>
              <ResponsiveDialogTrigger asChild>
                <BottomNavigationItem>
                  <BottomNavigationItemIcon>
                    <Backpack />
                  </BottomNavigationItemIcon>
                  <span className="sr-only">{m["ui.nav.inventory"]()}</span>
                </BottomNavigationItem>
              </ResponsiveDialogTrigger>
            </BottomNavigationListItem>
          </LazyInventoryDialog>
        </React.Suspense>
      </BottomNavigationList>
    </BottomNavigation>
  );
};
