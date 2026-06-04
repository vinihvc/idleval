import { Check } from "lucide-react";
import type { FactoryType } from "@/content/factories";
import { hasMoneyToBuy, upgradeFactory, useFactory } from "@/store";
import { amountFormatter } from "@/utils/formatters";
import { UpgradeCard, UpgradeCardTrigger } from "../../ui/upgrade-card";

type UpgradesCardProps = {
  /**
   * The factory type
   */
  factoryType: FactoryType;
};

export const UpgradesCard = (props: UpgradesCardProps) => {
  const { factoryType } = props;

  const { isUnlocked, isUpgraded, upgradeCost } = useFactory(factoryType);

  const canBuy = hasMoneyToBuy(upgradeCost);

  const getText = () => {
    if (!isUnlocked) {
      return "Unlock first";
    }
    if (isUpgraded) {
      return <Check />;
    }
    if (!canBuy) {
      return `Upgrade (${amountFormatter(upgradeCost)})`;
    }
    return "Upgrade";
  };

  return (
    <UpgradeCard
      factoryType={factoryType}
      image={`/images/upgrades/${factoryType}.webp`}
      isEnabled={isUpgraded}
      type="upgrade"
    >
      <UpgradeCardTrigger
        disabled={!isUnlocked || isUpgraded || !canBuy}
        onClick={() => upgradeFactory(factoryType)}
      >
        {getText()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
