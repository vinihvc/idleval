import { ArrowUpBox } from "pixelarticons/react/ArrowUpBox";
import { Backpack } from "pixelarticons/react/Backpack";
import { Briefcase } from "pixelarticons/react/Briefcase";
import { Crown } from "pixelarticons/react/Crown";
import type React from "react";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationItemIcon,
  BottomNavigationList,
  BottomNavigationListItem,
} from "@/components/ui/bottom-navigation";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { DIALOG_IDS, toggleDialog, useDialogs } from "@/store/atoms/dialogs";

export const Navigation = (
  props: React.ComponentProps<typeof BottomNavigation>
) => {
  const { className, ...rest } = props;

  const openDialogId = useDialogs();
  const isUpgradesOpen = openDialogId === DIALOG_IDS.upgrades;
  const isManagersOpen = openDialogId === DIALOG_IDS.managers;
  const isGodsOpen = openDialogId === DIALOG_IDS.gods;
  const isInventoryOpen = openDialogId === DIALOG_IDS.inventory;

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
        <BottomNavigationListItem>
          <BottomNavigationItem
            aria-expanded={isUpgradesOpen}
            onClick={() => toggleDialog(DIALOG_IDS.upgrades)}
          >
            <BottomNavigationItemIcon>
              <ArrowUpBox />
            </BottomNavigationItemIcon>
            <span className="sr-only">{m["ui.nav.upgrades"]()}</span>
          </BottomNavigationItem>
        </BottomNavigationListItem>

        <BottomNavigationListItem>
          <BottomNavigationItem
            aria-expanded={isManagersOpen}
            onClick={() => toggleDialog(DIALOG_IDS.managers)}
          >
            <BottomNavigationItemIcon>
              <Briefcase />
            </BottomNavigationItemIcon>
            <span className="sr-only">{m["ui.nav.managers"]()}</span>
          </BottomNavigationItem>
        </BottomNavigationListItem>

        <BottomNavigationListItem>
          <BottomNavigationItem
            aria-expanded={isGodsOpen}
            onClick={() => toggleDialog(DIALOG_IDS.gods)}
          >
            <BottomNavigationItemIcon>
              <Crown />
            </BottomNavigationItemIcon>
            <span className="sr-only">{m["ui.nav.gods"]()}</span>
          </BottomNavigationItem>
        </BottomNavigationListItem>

        <BottomNavigationListItem>
          <BottomNavigationItem
            aria-expanded={isInventoryOpen}
            onClick={() => toggleDialog(DIALOG_IDS.inventory)}
          >
            <BottomNavigationItemIcon>
              <Backpack />
            </BottomNavigationItemIcon>
            <span className="sr-only">{m["ui.nav.inventory"]()}</span>
          </BottomNavigationItem>
        </BottomNavigationListItem>
      </BottomNavigationList>
    </BottomNavigation>
  );
};
