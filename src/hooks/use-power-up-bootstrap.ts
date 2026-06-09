import React from "react";
import { refreshDailyStreakState } from "@/store/atoms/power-ups.actions";

export const usePowerUpBootstrap = () => {
  React.useEffect(() => {
    refreshDailyStreakState();
  }, []);
};
