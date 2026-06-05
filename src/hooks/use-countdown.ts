import { useAtomValue } from "jotai";
import React from "react";
import type { FactoryType } from "@/content/factories";
import { store } from "@/providers/store";
import { stopProducing, useFactory } from "@/store/atoms/factories";
import { offlineCycleProgressAtom } from "@/store/atoms/session";
import { useInterval } from "./use-interval";

const getInitialSeconds = (
  factory: FactoryType,
  productionTime: number,
  isActive: boolean,
  offlineProgress: Partial<Record<FactoryType, number>>
) => {
  const fromOffline = offlineProgress[factory];

  if (fromOffline != null && isActive) {
    return fromOffline;
  }

  return productionTime;
};

/**
 * Emit a countdown timer for a factory
 */
export const useCountdown = (factory: FactoryType) => {
  const { isUnlocked, isAutomated, isProducing, productionTime } =
    useFactory(factory);

  const offlineProgress = useAtomValue(offlineCycleProgressAtom);
  const isActive = isUnlocked && (isAutomated || isProducing);
  const consumedOfflineRef = React.useRef(false);

  const [seconds, setSeconds] = React.useState(() =>
    getInitialSeconds(factory, productionTime, isActive, offlineProgress)
  );
  const [cycleKey, setCycleKey] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(isActive);

  React.useEffect(() => {
    if (isActive) {
      if (!consumedOfflineRef.current && offlineProgress[factory] != null) {
        consumedOfflineRef.current = true;
        setSeconds(offlineProgress[factory] ?? productionTime);
        setCycleKey((key) => key + 1);
        setIsRunning(true);
        store.set(offlineCycleProgressAtom, (prev) => {
          const { [factory]: _removed, ...rest } = prev;

          return rest;
        });
        return;
      }

      setSeconds(productionTime);
      setCycleKey((key) => key + 1);
      setIsRunning(true);
      return;
    }

    consumedOfflineRef.current = false;
    setIsRunning(false);
  }, [factory, isActive, offlineProgress, productionTime]);

  useInterval(
    () => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(isUnlocked && isAutomated);
          stopProducing(factory);
          setCycleKey((key) => key + 1);
          return productionTime;
        }

        return prev - 1;
      });
    },
    isRunning ? 1000 : undefined
  );

  return { seconds, isRunning, cycleKey };
};
