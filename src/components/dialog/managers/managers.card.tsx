import { UpgradeCard } from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { autoFactory, useFactory } from "@/store/atoms/factories";

interface ManagersCardProps {
  factoryType: FactoryType;
}

export const ManagersCard = (props: ManagersCardProps) => {
  const { factoryType } = props;

  const { isAutomated, managerCost, manager } = useFactory(factoryType);

  return (
    <UpgradeCard
      actionLabel="Appoint"
      complete={isAutomated}
      cost={managerCost}
      description={manager.description}
      factoryType={factoryType}
      image={`/images/managers/${factoryType}.webp`}
      onAction={() => autoFactory(factoryType)}
      title={manager.name}
    />
  );
};
