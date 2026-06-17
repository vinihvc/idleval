import type { FactoryType } from "@/content/factories";
import { getScaledFactoryConfig } from "@/game/balance";
import { startCycleTick } from "@/game/factory-cycle";
import type { FactoryTickState } from "@/store/atoms/production-ticks.atom";

export interface FactoryTickSyncResult {
  changed: boolean;
  clearOfflineProgress?: boolean;
  tick: FactoryTickState;
}

export interface ManualCycleAnchor {
  productionDurationSec: number;
  productionStartedAt: number;
}

export const syncActiveFactoryTick = (
  factory: FactoryType,
  currentTick: FactoryTickState,
  offlineProgress: Partial<Record<FactoryType, number>>,
  consumedOffline: Set<FactoryType>,
  productionTime: number = getScaledFactoryConfig(factory).productionTime,
  persistedSecondsRemaining?: number | null,
  manualCycleAnchor?: ManualCycleAnchor | null,
  now: number = Date.now()
): FactoryTickSyncResult => {
  const fromOffline = offlineProgress[factory];

  if (fromOffline != null && !consumedOffline.has(factory)) {
    consumedOffline.add(factory);

    return {
      changed: true,
      clearOfflineProgress: true,
      tick: startCycleTick(currentTick, {
        durationSec: productionTime,
        now,
        remainingSec: fromOffline,
      }),
    };
  }

  if (!currentTick.isRunning) {
    if (manualCycleAnchor) {
      const { productionDurationSec, productionStartedAt } = manualCycleAnchor;
      const cycleEndsAt = productionStartedAt + productionDurationSec * 1000;
      const remainingSec = Math.max(0, (cycleEndsAt - now) / 1000);

      return {
        changed: true,
        tick: startCycleTick(currentTick, {
          durationSec: productionDurationSec,
          now,
          remainingSec,
        }),
      };
    }

    const seconds = persistedSecondsRemaining ?? productionTime;

    return {
      changed: true,
      tick: startCycleTick(currentTick, {
        durationSec: productionTime,
        now,
        remainingSec: seconds,
      }),
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
