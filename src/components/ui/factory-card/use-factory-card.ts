import React from "react";
import type { FactoryType } from "@/content/factories";
import { getEffectiveProductionTime } from "@/game/power-ups";
import { isFactorySealed } from "@/game/purchases";
import { useFactory } from "@/store/atoms/factories";
import { useInventory } from "@/store/atoms/inventory";
import { useWallet } from "@/store/atoms/wallet";
import { useCountdown } from "./use-countdown";

export const useFactoryCardModel = (factoryType: FactoryType) => {
  const factory = useFactory(factoryType);
  const { activePowerUp } = useInventory();
  const { gold } = useWallet();
  const { seconds, isRunning, cycleKey } = useCountdown(factoryType);

  const isLocked = isFactorySealed({
    gold,
    isUnlocked: factory.isUnlocked,
    unlockPrice: factory.unlockPrice,
  });

  return React.useMemo(
    () => ({
      factoryType,
      cycleKey,
      isRunning,
      seconds,
      isLocked,
      ...factory,
      productionTime: getEffectiveProductionTime(
        factory.productionTime,
        activePowerUp
      ),
    }),
    [
      factoryType,
      cycleKey,
      isRunning,
      seconds,
      isLocked,
      factory,
      activePowerUp,
    ]
  );
};

export type FactoryCardModel = ReturnType<typeof useFactoryCardModel>;
