import React from "react";
import type { FactoryType } from "@/content/factories";
import { getEffectiveProductionTime } from "@/game/power-ups";
import { isFactorySealed } from "@/game/purchases";
import { useLocalizedFactoryView } from "@/hooks/use-localized-factory-view";
import { useGodsProductionSpeedMultiplier } from "@/store/atoms/gods";
import { useInventory } from "@/store/atoms/inventory";
import { useFactoryTick } from "@/store/atoms/production-ticks.atom";
import { useWallet } from "@/store/atoms/wallet";
import { useFactoryProgress } from "./use-factory-progress";

export const useFactoryCardModel = (factoryType: FactoryType) => {
  const factory = useLocalizedFactoryView(factoryType);
  const { activePowerUp } = useInventory();
  const godsSpeedMultiplier = useGodsProductionSpeedMultiplier();
  const { gold } = useWallet();
  const tick = useFactoryTick(factoryType);

  const isLocked = isFactorySealed({
    gold,
    isUnlocked: factory.isUnlocked,
    unlockPrice: factory.unlockPrice,
  });

  const idleProductionTime = getEffectiveProductionTime(
    factory.productionTime,
    activePowerUp,
    godsSpeedMultiplier
  );
  const progress = useFactoryProgress(tick, idleProductionTime);

  return React.useMemo(
    () => ({
      factoryType,
      cycleKey: tick.cycleKey,
      isRunning: tick.isRunning,
      isLocked,
      ...factory,
      productionTime: tick.isRunning
        ? progress.durationSec
        : idleProductionTime,
      progress: progress.progress,
      remainingSec: progress.remainingSec,
      seconds: progress.remainingSec,
    }),
    [
      factoryType,
      tick.cycleKey,
      tick.isRunning,
      isLocked,
      factory,
      idleProductionTime,
      progress.durationSec,
      progress.progress,
      progress.remainingSec,
    ]
  );
};

export type FactoryCardModel = ReturnType<typeof useFactoryCardModel>;
