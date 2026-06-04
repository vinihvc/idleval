import React from "react";
import type { FactoryType } from "@/content/factories";
import { stopProducing, useFactory } from "@/store/atoms/factories";
import { useInterval } from "./use-interval";

/**
 * Emit a countdown timer for a factory
 */
export const useCountdown = (factory: FactoryType) => {
  const {
    isUnlocked,
    isAutomated,
    isProducing,
    productionTime,
  } = useFactory(factory);

  const isActive = isUnlocked && (isAutomated || isProducing);

  const [seconds, setSeconds] = React.useState(productionTime);
  const [isRunning, setIsRunning] = React.useState(isActive);

  React.useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  useInterval(
    () => {
      if (seconds > 0 && isRunning) {
        setSeconds(seconds - 1);
      }

      if (seconds < 1) {
        setSeconds(productionTime);
        setIsRunning(isUnlocked && isAutomated);
        stopProducing(factory);
      }
    },
    isRunning ? 1000 : undefined
  );

  return { seconds, isRunning };
};
