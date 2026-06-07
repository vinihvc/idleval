import { FACTORIES, type FactoryType } from "@/content/factories";
import type { FactoryTickState } from "@/store/atoms/production-ticks.atom";

export interface FactoryTickSyncResult {
  changed: boolean;
  clearOfflineProgress?: boolean;
  tick: FactoryTickState;
}

export const syncActiveFactoryTick = (
  factory: FactoryType,
  currentTick: FactoryTickState,
  offlineProgress: Partial<Record<FactoryType, number>>,
  consumedOffline: Set<FactoryType>
): FactoryTickSyncResult => {
  const { productionTime } = FACTORIES[factory];
  const fromOffline = offlineProgress[factory];

  if (fromOffline != null && !consumedOffline.has(factory)) {
    consumedOffline.add(factory);

    return {
      changed: true,
      clearOfflineProgress: true,
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

export const syncInactiveFactoryTick = (
  factory: FactoryType,
  currentTick: FactoryTickState,
  consumedOffline: Set<FactoryType>
): FactoryTickSyncResult => {
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
