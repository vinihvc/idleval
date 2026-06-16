import React from "react";
import type { FactoryType } from "@/content/factories";
import { type FactoryCardModel, useFactoryCardModel } from "./use-factory-card";

type FactoryCardContextValue = FactoryCardModel;

const FactoryCardContext = React.createContext({} as FactoryCardContextValue);

interface FactoryCardProviderProps extends React.PropsWithChildren {
  factoryType: FactoryType;
}

export const FactoryCardProvider = (props: FactoryCardProviderProps) => {
  const { factoryType, children } = props;
  const value = useFactoryCardModel(factoryType);

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
