import { Gift } from "pixelarticons/react/Gift";
import { Menu } from "pixelarticons/react/Menu";
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
import { useNotifications } from "@/store/atoms/notifications";
import { AmountToBuy } from "./header.amount";
import { HeaderWiki } from "./header.wiki";

const LazySettingsDialog = React.lazy(
  () => import("@/components/dialog/settings/settings")
);

const LazyDailyRewardDialog = React.lazy(
  () => import("@/components/dialog/daily-reward/daily-reward")
);

export const HeaderActions = () => {
  const notifications = useNotifications();

  return (
    <nav aria-label={m["ui.nav.actions"]()} className="flex gap-2">
      <AmountToBuy />

      <React.Suspense fallback={null}>
        <LazyDailyRewardDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <ResponsiveDialogTrigger asChild>
                <Button size="icon-md" variant="cream">
                  <span className="sr-only">{m["ui.nav.daily"]()}</span>
                  <Gift />
                  {notifications.daily && (
                    <Float>
                      <Status variant="success" />
                    </Float>
                  )}
                </Button>
              </ResponsiveDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{m["ui.nav.daily"]()}</TooltipContent>
          </Tooltip>
        </LazyDailyRewardDialog>
      </React.Suspense>
      <HeaderWiki />
      <React.Suspense fallback={null}>
        <LazySettingsDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <ResponsiveDialogTrigger asChild>
                <Button size="icon-md" variant="cream">
                  <span className="sr-only">{m["ui.settings.open"]()}</span>
                  <Menu />
                </Button>
              </ResponsiveDialogTrigger>
            </TooltipTrigger>

            <TooltipContent>{m["ui.settings.title"]()}</TooltipContent>
          </Tooltip>
        </LazySettingsDialog>
      </React.Suspense>
    </nav>
  );
};
