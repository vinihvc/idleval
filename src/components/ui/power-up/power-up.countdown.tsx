import type { ActivePowerUpDisplay } from "@/game/power-ups";
import { cn } from "@/lib/cn";
import { formatElapsedDuration } from "@/utils/formatters";

interface PowerUpCountdownProps {
  className?: string;
  display: ActivePowerUpDisplay;
}

export const PowerUpCountdown = (props: PowerUpCountdownProps) => {
  const { display, className } = props;

  if (display.kind === "pending-harvest") {
    return (
      <span
        className={cn("font-number text-xs tabular-nums sm:text-sm", className)}
        data-slot="power-up-countdown"
      >
        ×3
      </span>
    );
  }

  return (
    <span
      className={cn("font-number text-xs tabular-nums sm:text-sm", className)}
      data-slot="power-up-countdown"
    >
      {formatElapsedDuration(display.remainingMs ?? 0)}
    </span>
  );
};
