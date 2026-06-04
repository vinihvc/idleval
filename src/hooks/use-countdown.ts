import React from "react";
import type { FactoryType } from "@/content/factories";
import { stopProducing, useFactory } from "@/store/atoms/factories";
import { useInterval } from "./use-interval";

/**
 * Emit a countdown timer for a factory
 */
export const useCountdown = (factory: FactoryType) => {
  const f = useFactory(factory);

  const [seconds, setSeconds] = React.useState(f.productionTime);
  const [isRunning, setIsRunning] = React.useState(
    f.isAutomated || f.isProducing
  );

  React.useEffect(() => {
    setIsRunning(f.isAutomated || f.isProducing);
  }, [f.isAutomated, f.isProducing]);

  useInterval(
    () => {
      if (seconds > 0 && isRunning) {
        setSeconds(seconds - 1);
      }

      if (seconds < 1) {
        setSeconds(f.productionTime);
        setIsRunning(f.isAutomated);
        stopProducing(factory);
      }
    },
    isRunning && f.isUnlocked ? 1000 : undefined
  );

  return { seconds, isRunning };
};
