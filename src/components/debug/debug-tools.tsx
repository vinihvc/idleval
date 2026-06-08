import { ArrowUpBox } from "pixelarticons/react/ArrowUpBox";
import { Briefcase } from "pixelarticons/react/Briefcase";
import { Coins } from "pixelarticons/react/Coins";
import { Crown } from "pixelarticons/react/Crown";
import { Lock } from "pixelarticons/react/Lock";
import { Reload } from "pixelarticons/react/Reload";
import {
  ActionBar,
  ActionBarBody,
  ActionBarContent,
} from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { NumberText } from "@/components/ui/number-text";
import { IS_DEV } from "@/lib/envs";
import {
  addDebugGold,
  DEBUG_GOLD_AMOUNT,
  enableAllManagers,
  enableAllUpgrades,
  enableGodMode,
  resetGameState,
  unlockAllFactories,
} from "@/store/debug";
import { amountFormatterWithDolarSign } from "@/utils/formatters";

export const DebugTools = () => {
  if (!IS_DEV) {
    return null;
  }

  return (
    <ActionBar open>
      <ActionBarContent aria-label="Debug tools" className="hidden sm:flex">
        <ActionBarBody>
          <Button
            aria-label="Reset game state"
            onClick={resetGameState}
            variant="destructive"
          >
            <Reload />
            <span className="max-md:sr-only">Reset </span>
          </Button>
          <Button
            aria-label="Add debug gold"
            onClick={addDebugGold}
            variant="green"
          >
            <Coins />
            <span className="max-md:sr-only">
              Add{" "}
              <NumberText variant="green">
                {amountFormatterWithDolarSign(DEBUG_GOLD_AMOUNT)}
              </NumberText>
            </span>
          </Button>
          <Button
            aria-label="Unlock all factories"
            onClick={unlockAllFactories}
            variant="brown"
          >
            <Lock />
            <span className="max-md:sr-only">Factories</span>
          </Button>
          <Button
            aria-label="Enable all upgrades"
            onClick={enableAllUpgrades}
            variant="default"
          >
            <ArrowUpBox />
            <span className="max-md:sr-only">Upgrades</span>
          </Button>
          <Button
            aria-label="Enable all managers"
            onClick={enableAllManagers}
            variant="blue"
          >
            <Briefcase />
            <span className="max-md:sr-only">Managers</span>
          </Button>
          <Button
            aria-label="Enable god mode"
            onClick={enableGodMode}
            variant="purple"
          >
            <Crown />
            <span className="max-md:sr-only">God mode</span>
          </Button>
        </ActionBarBody>
      </ActionBarContent>
    </ActionBar>
  );
};
