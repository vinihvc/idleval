import { FactoryActionCard } from "@/components/dialog/factory-action-card";
import type { FactoryType } from "@/content/factories";
import { upgradeFactory, useFactory } from "@/store/atoms/factories";

interface UpgradesCardProps {
  factoryType: FactoryType;
}

export const UpgradesCard = (props: UpgradesCardProps) => {
  const { factoryType } = props;

  const { isUpgraded, upgradeCost, upgrade } = useFactory(factoryType);

  return (
    <FactoryActionCard
      actionLabel="Improve"
      cost={upgradeCost}
      factoryType={factoryType}
      imagePath={`/images/upgrades/${factoryType}.webp`}
      isComplete={isUpgraded}
      lore={upgrade}
      onAction={() => upgradeFactory(factoryType)}
    />
  );
};
