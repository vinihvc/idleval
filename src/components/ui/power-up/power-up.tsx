import type React from "react";
import { Badge } from "@/components/ui/badge";
import { useActivePowerUpDisplay } from "@/hooks/use-active-power-up-display";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { formatElapsedDuration } from "@/utils/formatters";
import { PowerUpCountdown } from "./power-up.countdown";
import { PowerUpIcon } from "./power-up.icon";

interface GameStagePowerUpProps extends React.ComponentProps<"div"> {}

export const GameStagePowerUp = (props: GameStagePowerUpProps) => {
  const { className, ...rest } = props;

  const display = useActivePowerUpDisplay();

  if (!display) {
    return null;
  }

  return (
    <Badge
      aria-label={
        display.kind === "pending-harvest"
          ? m["ui.powerUp.cauldronPending"]()
          : m["ui.powerUp.remaining"]({
              duration: formatElapsedDuration(display.remainingMs ?? 0),
            })
      }
      className={cn(
        "min-w-0",
        "flex items-center justify-end gap-2",
        className
      )}
      data-active
      data-slot="power-up"
      role="status"
      {...rest}
    >
      <PowerUpCountdown display={display} />
      <PowerUpIcon powerUpId={display.powerUpId} />
    </Badge>
  );
};
