import React from "react";
import {
  getActivePowerUpDisplayState,
  isTimedPowerUpActive,
} from "@/game/power-ups";
import { useInventory } from "@/store/atoms/inventory";

export const useActivePowerUpDisplay = () => {
  const { activePowerUp } = useInventory();
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!isTimedPowerUpActive(activePowerUp)) {
      return;
    }

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [activePowerUp]);

  return getActivePowerUpDisplayState(activePowerUp, now);
};
