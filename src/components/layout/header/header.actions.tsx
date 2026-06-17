import { Gift } from "pixelarticons/react/Gift";
import { Menu } from "pixelarticons/react/Menu";
import React from "react";
import { Button } from "@/components/ui/button";
import { Float } from "@/components/ui/float";
import { Status } from "@/components/ui/status";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { useNotifications } from "@/store/atoms/notifications";
import { AmountToBuy } from "./header.amount";

const LazySettingsDialog = React.lazy(() =>
  import("@/components/dialog/settings/settings").then((module) => ({
    default: module.SettingsDialog,
  }))
);

const LazyDailyRewardDialog = React.lazy(() =>
  import("@/components/dialog/daily-reward/daily-reward").then((module) => ({
    default: module.DailyRewardDialog,
  }))
);

export const HeaderActions = () => {
  const notifications = useNotifications();

  return (
    <>
      <nav aria-label={m["ui.nav.actions"]()} className="flex gap-2">
        <AmountToBuy />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => toggleDialog(DIALOG_IDS.dailyReward)}
              size="icon-sm"
              variant="cream"
            >
              <span className="sr-only">{m["ui.nav.daily"]()}</span>
              <Gift />
              {notifications.daily && (
                <Float>
                  <Status variant="success" />
                </Float>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{m["ui.nav.daily"]()}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => toggleDialog(DIALOG_IDS.settings)}
              size="icon-sm"
              variant="cream"
            >
              <span className="sr-only">{m["ui.settings.open"]()}</span>
              <Menu />
            </Button>
          </TooltipTrigger>

          <TooltipContent>{m["ui.settings.title"]()}</TooltipContent>
        </Tooltip>
      </nav>

      <React.Suspense fallback={null}>
        <LazySettingsDialog />
      </React.Suspense>

      <React.Suspense fallback={null}>
        <LazyDailyRewardDialog />
      </React.Suspense>
    </>
  );
};
