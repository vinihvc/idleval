import { AppWindows } from "pixelarticons/react/AppWindows";
import { ArrowUpBox } from "pixelarticons/react/ArrowUpBox";
import { Briefcase } from "pixelarticons/react/Briefcase";
import { Coins } from "pixelarticons/react/Coins";
import { Crown } from "pixelarticons/react/Crown";
import { Gift } from "pixelarticons/react/Gift";
import { Lock } from "pixelarticons/react/Lock";
import { Message } from "pixelarticons/react/Message";
import { Potion } from "pixelarticons/react/Potion";
import { Reload } from "pixelarticons/react/Reload";
import React from "react";
import {
  ActionBar,
  ActionBarBody,
  ActionBarContent,
} from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IS_DEV } from "@/lib/envs";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import {
  addDebugGold,
  addDebugPowerUps,
  enableAllManagers,
  enableAllUpgrades,
  enableGodMode,
  openDebugOfflineEarning,
  resetGameState,
  unlockAllFactories,
} from "@/store/debug";

const LazyWelcomeDialog = React.lazy(
  () => import("@/components/dialog/welcome/welcome")
);

export const ActionTools = () => {
  if (!IS_DEV) {
    return null;
  }

  return (
    <>
      <ActionBar open>
        <ActionBarContent aria-label="Debug tools" className="hidden sm:flex">
          <ActionBarBody>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={resetGameState}
                  size="icon-lg"
                  variant="destructive"
                >
                  <span className="sr-only">Reset</span>
                  <Reload />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={addDebugGold} size="icon-lg" variant="default">
                  <span className="sr-only">Gold</span>
                  <Coins />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Gold</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={unlockAllFactories}
                  size="icon-lg"
                  variant="brown"
                >
                  <span className="sr-only">Factories</span>
                  <Lock />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Factories</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={enableAllUpgrades}
                  size="icon-lg"
                  variant="green"
                >
                  <span className="sr-only">Upgrades</span>
                  <ArrowUpBox />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upgrades</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={enableAllManagers}
                  size="icon-lg"
                  variant="blue"
                >
                  <span className="sr-only">Managers</span>
                  <Briefcase />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Managers</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={addDebugPowerUps}
                  size="icon-lg"
                  variant="stone"
                >
                  <span className="sr-only">Relics</span>
                  <Potion />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Relics</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={enableGodMode} size="icon-lg" variant="purple">
                  <span className="sr-only">God mode</span>
                  <Crown />
                </Button>
              </TooltipTrigger>
              <TooltipContent>God mode</TooltipContent>
            </Tooltip>
            <Menu positioning={{ placement: "right-start" }}>
              <MenuTrigger asChild>
                <Button size="icon-lg" variant="ember">
                  <span className="sr-only">Dialogs</span>
                  <AppWindows />
                </Button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem onSelect={openDebugOfflineEarning} value="offline">
                  <Gift aria-hidden />
                  Offline earning
                </MenuItem>
                <MenuItem
                  onSelect={() => {
                    toggleDialog(DIALOG_IDS.debugWelcome);
                  }}
                  value="welcome"
                >
                  <Message aria-hidden />
                  Welcome
                </MenuItem>
              </MenuContent>
            </Menu>
          </ActionBarBody>
        </ActionBarContent>
      </ActionBar>

      <React.Suspense fallback={null}>
        <LazyWelcomeDialog debug />
      </React.Suspense>
    </>
  );
};
