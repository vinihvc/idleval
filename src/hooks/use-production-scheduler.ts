import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import {
  FACTORIES,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";
import { useInterval } from "@/hooks/use-interval";
import { store } from "@/providers/store";
import { completeProductionCycle } from "@/store/atoms/factories";
import { factoriesAtom } from "@/store/atoms/factories.atom";
import { getFactory } from "@/store/atoms/factories.selectors";
import {
  type FactoryTickState,
  productionTicksAtom,
} from "@/store/atoms/production-ticks.atom";
import { offlineCycleProgressAtom } from "@/store/atoms/session";

const syncActiveFactoryTick = (
  factory: FactoryType,
  currentTick: FactoryTickState,
  offlineProgress: Partial<Record<FactoryType, number>>,
  consumedOffline: Set<FactoryType>
): { changed: boolean; tick: FactoryTickState } => {
  const { productionTime } = FACTORIES[factory];
  const fromOffline = offlineProgress[factory];

  if (fromOffline != null && !consumedOffline.has(factory)) {
    consumedOffline.add(factory);
    store.set(offlineCycleProgressAtom, (previousProgress) => {
      const { [factory]: _removed, ...rest } = previousProgress;

      return rest;
    });

    return {
      changed: true,
      tick: {
        cycleKey: currentTick.cycleKey + 1,
        isRunning: true,
        seconds: fromOffline,
      },
    };
  }

  if (!currentTick.isRunning) {
    return {
      changed: true,
      tick: {
        cycleKey: currentTick.cycleKey + 1,
        isRunning: true,
        seconds: productionTime,
      },
    };
  }

  return { changed: false, tick: currentTick };
};

const syncInactiveFactoryTick = (
  factory: FactoryType,
  currentTick: FactoryTickState,
  consumedOffline: Set<FactoryType>
): { changed: boolean; tick: FactoryTickState } => {
  consumedOffline.delete(factory);

  if (!currentTick.isRunning) {
    return { changed: false, tick: currentTick };
  }

  return {
    changed: true,
    tick: {
      ...currentTick,
      isRunning: false,
    },
  };
};

const tickRunningFactory = (
  factory: FactoryType,
  currentTick: FactoryTickState
): { changed: boolean; tick: FactoryTickState } => {
  const { isAutomated, isUnlocked, productionTime } = getFactory(factory);

  if (currentTick.seconds <= 1) {
    completeProductionCycle(factory);

    return {
      changed: true,
      tick: {
        cycleKey: currentTick.cycleKey + 1,
        isRunning: isUnlocked && isAutomated,
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
  const factories = useAtomValue(factoriesAtom);
  const offlineProgress = useAtomValue(offlineCycleProgressAtom);
  const setTicks = useSetAtom(productionTicksAtom);
  const consumedOfflineRef = React.useRef(new Set<FactoryType>());

  const hasRunningFactory = React.useMemo(
    () =>
      FACTORY_TYPES.some((factory) => {
        const { isAutomated, isProducing, isUnlocked } = factories[factory];

        return isUnlocked && (isAutomated || isProducing);
      }),
    [factories]
  );

  React.useEffect(() => {
    setTicks((previousTicks) => {
      let changed = false;
      const nextTicks = { ...previousTicks };

      for (const factory of FACTORY_TYPES) {
        const state = factories[factory];
        const isActive =
          state.isUnlocked && (state.isAutomated || state.isProducing);
        const currentTick = previousTicks[factory];
        const syncResult = isActive
          ? syncActiveFactoryTick(
              factory,
              currentTick,
              offlineProgress,
              consumedOfflineRef.current
            )
          : syncInactiveFactoryTick(
              factory,
              currentTick,
              consumedOfflineRef.current
            );

        if (syncResult.changed) {
          nextTicks[factory] = syncResult.tick;
          changed = true;
        }
      }

      return changed ? nextTicks : previousTicks;
    });
  }, [factories, offlineProgress, setTicks]);

  useInterval(
    () => {
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
