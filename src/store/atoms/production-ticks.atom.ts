import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import {
  FACTORIES,
  FACTORY_TYPES,
  type FactoryType,
} from "@/content/factories";

export interface FactoryTickState {
  cycleKey: number;
  isRunning: boolean;
  seconds: number;
}

const createInitialTicks = (): Record<FactoryType, FactoryTickState> =>
  Object.fromEntries(
    FACTORY_TYPES.map((factory) => [
      factory,
      {
        cycleKey: 0,
        isRunning: false,
        seconds: FACTORIES[factory].productionTime,
      },
    ])
  ) as Record<FactoryType, FactoryTickState>;

export const productionTicksAtom = atom<Record<FactoryType, FactoryTickState>>(
  createInitialTicks()
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
