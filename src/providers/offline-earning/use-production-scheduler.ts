import { useSetAtom } from "jotai";
import React from "react";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { isFactoryDrivenByScheduler } from "@/game/factories";
import { reconcileManualCycle } from "@/game/manual-production";
import type { FactoryPersistedState } from "@/game/types";
import { store } from "@/providers/store";
import {
  completeProductionCycle,
  getFactory,
  useFactories,
} from "@/store/atoms/factories";
import { getEffectiveProductionTimeForActivePowerUp } from "@/store/atoms/inventory";
import { refreshExpiredPowerUps } from "@/store/atoms/power-ups.actions";
import {
  type FactoryTickState,
  productionTicksAtom,
} from "@/store/atoms/production-ticks.atom";
import {
  offlineCycleProgressAtom,
  useOfflineCycleProgress,
} from "@/store/offline-earning";
import {
  syncActiveFactoryTick,
  syncInactiveFactoryTick,
} from "./production-scheduler-sync";
import { useInterval } from "./use-interval";

const tickRunningFactory = (
  factory: FactoryType,
  currentTick: FactoryTickState
): { changed: boolean; tick: FactoryTickState } => {
  const factoryState = getFactory(factory);
  const { isAutomated, isUnlocked } = factoryState;
  const productionTime = getEffectiveProductionTimeForActivePowerUp(
    factoryState.productionTime
  );
  const keepsRunning = isUnlocked && isAutomated;

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

const getPersistedManualSecondsRemaining = (
  state: FactoryPersistedState,
  now: number
): number | null => {
  const reconcileResult = reconcileManualCycle(state, now);

  if (reconcileResult.kind === "in_progress") {
    return reconcileResult.secondsRemaining;
  }

  return null;
};

const syncFactoryTicks = (
  previousTicks: Record<FactoryType, FactoryTickState>,
  factories: Record<FactoryType, FactoryPersistedState>,
  offlineProgress: Partial<Record<FactoryType, number>>,
  consumedOffline: Set<FactoryType>,
  now: number
): { changed: boolean; nextTicks: Record<FactoryType, FactoryTickState> } => {
  let changed = false;
  const nextTicks = { ...previousTicks };

  for (const factory of FACTORY_TYPES) {
    const state = factories[factory];
    const isActive = isFactoryDrivenByScheduler(factory, state);
    const currentTick = previousTicks[factory];
    const persistedSecondsRemaining =
      state.isProducing && !state.isAutomated
        ? getPersistedManualSecondsRemaining(state, now)
        : null;
    const syncResult = isActive
      ? syncActiveFactoryTick(
          factory,
          currentTick,
          offlineProgress,
          consumedOffline,
          getEffectiveProductionTimeForActivePowerUp(
            getFactory(factory).productionTime
          ),
          persistedSecondsRemaining
        )
      : syncInactiveFactoryTick(factory, currentTick, consumedOffline);

    if (!syncResult.changed) {
      continue;
    }

    if (syncResult.clearOfflineProgress) {
      store.set(offlineCycleProgressAtom, (previousProgress) => {
        const { [factory]: _removed, ...rest } = previousProgress;

        return rest;
      });
    }

    nextTicks[factory] = syncResult.tick;
    changed = true;
  }

  return { changed, nextTicks };
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
    const now = Date.now();

    setTicks((previousTicks) => {
      const { changed, nextTicks } = syncFactoryTicks(
        previousTicks,
        factories,
        offlineProgress,
        consumedOfflineRef.current,
        now
      );

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
