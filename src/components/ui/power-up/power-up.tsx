import { Image } from "@unpic/react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { POWER_UP_DATA } from "@/content/power-ups";
import { useActivePowerUpDisplay } from "@/hooks/use-active-power-up-display";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { countdownFormatter, formatElapsedDuration } from "@/utils/formatters";
import { borderedText } from "../text-border";

export const GameStagePowerUp = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  const display = useActivePowerUpDisplay();

  if (!display) {
    return null;
  }

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-slot="power-up"
      {...rest}
    >
      <span
        className={cn(
          "font-number text-base text-muted tabular-nums",
          borderedText({ variant: "default" })
        )}
        data-slot="power-up-countdown"
      >
        {countdownFormatter(display?.remainingMs ?? 0)}
      </span>

      <Badge
        aria-label={
          display.kind === "pending-harvest"
            ? m["ui.powerUp.cauldronPending"]()
            : m["ui.powerUp.remaining"]({
                duration: formatElapsedDuration(display.remainingMs ?? 0),
              })
        }
        data-slot="power-up-badge"
        role="status"
        size="lg"
      >
        <Image
          alt=""
          aria-hidden
          className="size-4 object-contain"
          data-slot="power-up-icon"
          height={400}
          src={POWER_UP_DATA[display.powerUpId]?.image}
          width={400}
        />
      </Badge>
    </div>
  );
};
