import { useProductionScheduler } from "@/hooks/use-production-scheduler";

export const ProductionScheduler = ({ children }: React.PropsWithChildren) => {
  useProductionScheduler();

  return children;
};
