import { useSetAtom } from "jotai";
import React from "react";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import {
  syncActiveFactoryTick,
  syncInactiveFactoryTick,
} from "@/hooks/production-scheduler-sync";
import { useInterval } from "@/hooks/use-interval";
import { store } from "@/providers/store";
import { completeProductionCycle, useFactories } from "@/store/atoms/factories";
import { getFactory } from "@/store/atoms/factories.selectors";
import {
  isFactoryDrivenByScheduler,
  isGhostCandleFactoryActive,
  refreshExpiredPowerUps,
} from "@/store/atoms/power-ups.actions";
import { getEffectiveProductionTimeForActivePowerUp } from "@/store/atoms/power-ups.selectors";
import {
  type FactoryTickState,
  productionTicksAtom,
} from "@/store/atoms/production-ticks.atom";
import {
  offlineCycleProgressAtom,
  useOfflineCycleProgress,
} from "@/store/offline-earning";

const tickRunningFactory = (
  factory: FactoryType,
  currentTick: FactoryTickState
): { changed: boolean; tick: FactoryTickState } => {
  const factoryState = getFactory(factory);
  const { isAutomated, isUnlocked } = factoryState;
  const productionTime = getEffectiveProductionTimeForActivePowerUp(
    factoryState.productionTime
  );
  const keepsRunning =
    isUnlocked && (isAutomated || isGhostCandleFactoryActive(factory));

  if (currentTick.seconds <= 1) {
    completeProductionCycle(factory);

    return {
      changed: true,
      tick: {
        cycleKey: currentTick.cycleKey + 1,
        isRunning: keepsRunning,
        seconds: productionTime,
      },
    };
  }

  return {
    changed: true,
    tick: {
      ...currentTick,
      seconds: currentTick.seconds - 1,
    },
  };
};

/**
 * Single game loop that drives all factory countdown timers.
 */
export const useProductionScheduler = () => {
  const factories = useFactories();
  const offlineProgress = useOfflineCycleProgress();
  const setTicks = useSetAtom(productionTicksAtom);
  const consumedOfflineRef = React.useRef(new Set<FactoryType>());

  const hasRunningFactory = React.useMemo(
    () =>
      FACTORY_TYPES.some((factory) =>
        isFactoryDrivenByScheduler(factory, factories[factory])
      ),
    [factories]
  );

  React.useEffect(() => {
    setTicks((previousTicks) => {
      let changed = false;
      const nextTicks = { ...previousTicks };

      for (const factory of FACTORY_TYPES) {
        const state = factories[factory];
        const isActive = isFactoryDrivenByScheduler(factory, state);
        const currentTick = previousTicks[factory];
        const syncResult = isActive
          ? syncActiveFactoryTick(
              factory,
              currentTick,
              offlineProgress,
              consumedOfflineRef.current,
              getEffectiveProductionTimeForActivePowerUp(
                getFactory(factory).productionTime
              )
            )
          : syncInactiveFactoryTick(
              factory,
              currentTick,
              consumedOfflineRef.current
            );

        if (syncResult.changed) {
          if (syncResult.clearOfflineProgress) {
            store.set(offlineCycleProgressAtom, (previousProgress) => {
              const { [factory]: _removed, ...rest } = previousProgress;

              return rest;
            });
          }

          nextTicks[factory] = syncResult.tick;
          changed = true;
        }
      }

      return changed ? nextTicks : previousTicks;
    });
  }, [factories, offlineProgress, setTicks]);

  useInterval(
    () => {
      refreshExpiredPowerUps();

      setTicks((previousTicks) => {
        let changed = false;
        const nextTicks = { ...previousTicks };

        for (const factory of FACTORY_TYPES) {
          const currentTick = previousTicks[factory];

          if (!currentTick.isRunning) {
            continue;
          }

          const tickResult = tickRunningFactory(factory, currentTick);

          if (tickResult.changed) {
            nextTicks[factory] = tickResult.tick;
            changed = true;
          }
        }

        return changed ? nextTicks : previousTicks;
      });
    },
    hasRunningFactory ? 1000 : undefined
  );
};
