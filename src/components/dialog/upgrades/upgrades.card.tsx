import { UpgradeCard } from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { upgradeFactory, useFactory } from "@/store/atoms/factories";

interface UpgradesCardProps {
  factoryType: FactoryType;
}

export const UpgradesCard = (props: UpgradesCardProps) => {
  const { factoryType } = props;

  const { isUpgraded, upgradeCost, upgrade } = useFactory(factoryType);

  return (
    <UpgradeCard
      actionLabel="Improve"
      complete={isUpgraded}
      cost={upgradeCost}
      description={upgrade.description}
      factoryType={factoryType}
      image={`/images/upgrades/${factoryType}.webp`}
      onAction={() => upgradeFactory(factoryType)}
      title={upgrade.name}
    />
  );
};
