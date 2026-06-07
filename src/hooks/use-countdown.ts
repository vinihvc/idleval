import type { FactoryType } from "@/content/factories";
import { useFactoryTick } from "@/store/atoms/production-ticks.atom";

/**
 * Read countdown state for a factory from the shared production scheduler.
 */
export const useCountdown = (factory: FactoryType) => {
  const { cycleKey, isRunning, seconds } = useFactoryTick(factory);

  return { cycleKey, isRunning, seconds };
};
