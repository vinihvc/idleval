import React from "react";
import type { FactoryType } from "@/content/factories";
import { isFactorySealed } from "@/game/purchases";
import { useCountdown } from "@/hooks/use-countdown";
import { useFactory } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";

interface FactoryCardContextValue {
  amount: ReturnType<typeof useFactory>["amount"];
  baseBuyCost: ReturnType<typeof useFactory>["baseBuyCost"];
  cycleKey: number;
  factoryType: FactoryType;
  isAutomated: boolean;
  isLocked: boolean;
  isProducing: boolean;
  isRunning: boolean;
  isUnlocked: boolean;
  isUpgraded: boolean;
  name: string;
  nextUnitCost: ReturnType<typeof useFactory>["nextUnitCost"];
  productionTime: number;
  seconds: number;
  unlockPrice: ReturnType<typeof useFactory>["unlockPrice"];
}

const FactoryCardContext = React.createContext({} as FactoryCardContextValue);

interface FactoryCardProviderProps extends React.PropsWithChildren {
  factoryType: FactoryType;
}

export const FactoryCardProvider = (props: FactoryCardProviderProps) => {
  const { factoryType, children } = props;

  const factory = useFactory(factoryType);
  const { gold } = useWallet();
  const { seconds, isRunning, cycleKey } = useCountdown(factoryType);

  const isLocked = isFactorySealed({
    gold,
    isUnlocked: factory.isUnlocked,
    unlockPrice: factory.unlockPrice,
  });

  const value = React.useMemo(
    (): FactoryCardContextValue => ({
      factoryType,
      cycleKey,
      isRunning,
      seconds,
      isLocked,
      ...factory,
    }),
    [factoryType, cycleKey, isRunning, seconds, isLocked, factory]
  );

  return (
    <FactoryCardContext.Provider value={value}>
      {children}
    </FactoryCardContext.Provider>
  );
};

export const useFactoryCard = (): FactoryCardContextValue => {
  const context = React.use(FactoryCardContext);

  if (!context) {
    throw new Error("useFactoryCard must be used within FactoryCardProvider");
  }

  return context;
};
