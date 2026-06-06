import { FactoryActionCard } from "@/components/dialog/factory-action-card";
import type { FactoryType } from "@/content/factories";
import { autoFactory, useFactory } from "@/store/atoms/factories";

interface ManagersCardProps {
  factoryType: FactoryType;
}

export const ManagersCard = (props: ManagersCardProps) => {
  const { factoryType } = props;

  const { isAutomated, managerCost, manager } = useFactory(factoryType);

  return (
    <FactoryActionCard
      actionLabel="Appoint"
      cost={managerCost}
      factoryType={factoryType}
      imagePath={`/images/managers/${factoryType}.webp`}
      isComplete={isAutomated}
      lore={manager}
      onAction={() => autoFactory(factoryType)}
    />
  );
};
