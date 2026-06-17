import { atom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { getScaledFactoryConfig } from "@/game/balance";
import type { FactoryCycleTick } from "@/game/factory-cycle";

export type FactoryTickState = FactoryCycleTick;

export const createInitialProductionTicks = (): Record<
  FactoryType,
  FactoryTickState
> =>
  Object.fromEntries(
    FACTORY_TYPES.map((factory) => {
      const productionTime = getScaledFactoryConfig(factory).productionTime;

      return [
        factory,
        {
          cycleDurationSec: productionTime,
          cycleEndsAt: 0,
          cycleKey: 0,
          isRunning: false,
          seconds: productionTime,
        },
      ];
    })
  ) as Record<FactoryType, FactoryTickState>;

export const productionTicksAtom = atom<Record<FactoryType, FactoryTickState>>(
  createInitialProductionTicks()
);

const factoryTickAtoms = new Map<
  FactoryType,
  ReturnType<
    typeof selectAtom<Record<FactoryType, FactoryTickState>, FactoryTickState>
  >
>();

export const getFactoryTickAtom = (factory: FactoryType) => {
  let factoryTickAtom = factoryTickAtoms.get(factory);

  if (!factoryTickAtom) {
    factoryTickAtom = selectAtom(
      productionTicksAtom,
      (ticks) => ticks[factory]
    );
    factoryTickAtoms.set(factory, factoryTickAtom);
  }

  return factoryTickAtom;
};

export const useFactoryTick = (factory: FactoryType) =>
  useAtomValue(getFactoryTickAtom(factory));
