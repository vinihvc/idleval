import React from "react";
import {
  type ActivePowerUpDisplay,
  getActivePowerUpDisplayState,
} from "@/game/power-ups";
import { useInventory } from "@/store/atoms/inventory";

const TICK_MS = 1000;

/**
 * Live HUD state for the active power-up, refreshed every second while active.
 */
export const useActivePowerUpDisplay = (): ActivePowerUpDisplay | null => {
  const { activePowerUp, pendingCauldronDrop } = useInventory();
  const [now, setNow] = React.useState(() => Date.now());

  const display = React.useMemo(
    () =>
      getActivePowerUpDisplayState({ activePowerUp, pendingCauldronDrop }, now),
    [activePowerUp, pendingCauldronDrop, now]
  );

  const timedExpiresAt = activePowerUp?.expiresAt ?? null;

  React.useEffect(() => {
    if (timedExpiresAt == null) {
      return;
    }

    const id = setInterval(() => {
      setNow(Date.now());
    }, TICK_MS);

    return () => clearInterval(id);
  }, [timedExpiresAt]);

  return display;
};
