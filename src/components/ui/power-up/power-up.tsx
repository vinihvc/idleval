import { Image } from "@unpic/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  ToggleTooltip,
  ToggleTooltipContent,
  ToggleTooltipTrigger,
} from "@/components/ui/toggle-tooltip";
import { POWER_UP_DATA, getLocalizedPowerUp } from "@/content/power-ups";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { countdownFormatter, formatElapsedDuration } from "@/utils/formatters";
import { borderedText } from "../text-border";
import { useActivePowerUpDisplay } from "./use-active-power-up-display";

export const GameStagePowerUp = (
  props: Omit<React.ComponentProps<typeof Button>, "children" | "size" | "variant">
) => {
  const { className, ...rest } = props;

  const display = useActivePowerUpDisplay();

  if (!display) {
    return null;
  }

  const powerUp = getLocalizedPowerUp(display.powerUpId);

  const remainingLabel = m["ui.powerUp.remaining"]({
    duration: formatElapsedDuration(display.remainingMs ?? 0),
  });

  return (
    <ToggleTooltip data-slot="power-up">
      <ToggleTooltipTrigger asChild>
        <Button
          aria-label={remainingLabel}
          className={className}
          data-slot="power-up-badge"
          size="icon-sm"
          variant="cream"
          {...rest}
        >
          <Image
            alt=""
            aria-hidden
            className="size-5 object-contain"
            data-slot="power-up-icon"
            height={400}
            src={POWER_UP_DATA[display.powerUpId]?.image}
            width={400}
          />
        </Button>
      </ToggleTooltipTrigger>

      <ToggleTooltipContent className="flex flex-col gap-2" fitContent>
        <h3 className="font-bold text-lg">{powerUp.name}</h3>
        <p>{powerUp.description}</p>
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{m["ui.powerUp.countdownLabel"]()}</p>
          <span
            className={cn(
              "font-number text-2xl text-muted tabular-nums",
              borderedText({ variant: "default", size: "lg" })
            )}
            data-slot="power-up-countdown"
          >
            {countdownFormatter(display.remainingMs ?? 0)}
          </span>
        </div>
      </ToggleTooltipContent>
    </ToggleTooltip>
  );
};
