import { ArrowUpBox } from "pixelarticons/react/ArrowUpBox";
import { Backpack } from "pixelarticons/react/Backpack";
import { Briefcase } from "pixelarticons/react/Briefcase";
import { Crown } from "pixelarticons/react/Crown";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Float } from "@/components/ui/float";
import { Status } from "@/components/ui/status";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { useNotifications } from "@/store/atoms/notifications";

export const HeaderNavigation = (props: React.ComponentProps<"nav">) => {
  const { className, ...rest } = props;

  const notifications = useNotifications();

  return (
    <nav
      aria-label={m["ui.nav.gameSections"]()}
      className={cn("hidden items-center gap-2 sm:flex", className)}
      {...rest}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => toggleDialog(DIALOG_IDS.upgrades)}
            size="icon-sm"
            variant="cream"
          >
            <span className="sr-only">{m["ui.nav.upgrades"]()}</span>
            <ArrowUpBox />
            {notifications.upgrades && (
              <Float>
                <Status variant="success" />
              </Float>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m["ui.nav.upgrades"]()}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => toggleDialog(DIALOG_IDS.managers)}
            size="icon-sm"
            variant="cream"
          >
            <span className="sr-only">{m["ui.nav.managers"]()}</span>
            <Briefcase />
            {notifications.managers && (
              <Float>
                <Status variant="success" />
              </Float>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m["ui.nav.managers"]()}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => toggleDialog(DIALOG_IDS.gods)}
            size="icon-sm"
            variant="cream"
          >
            <span className="sr-only">{m["ui.nav.gods"]()}</span>
            <Crown />
            {notifications.gods && (
              <Float>
                <Status variant="success" />
              </Float>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m["ui.nav.gods"]()}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => toggleDialog(DIALOG_IDS.inventory)}
            size="icon-sm"
            variant="cream"
          >
            <span className="sr-only">{m["ui.nav.inventory"]()}</span>
            <Backpack />
            {notifications.inventory && (
              <Float>
                <Status variant="success" />
              </Float>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m["ui.nav.inventory"]()}</TooltipContent>
      </Tooltip>
    </nav>
  );
};
