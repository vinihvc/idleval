import { Check } from "pixelarticons/react";
import { Badge } from "@/components/ui/badge";
import { NumberText } from "@/components/ui/number-text";
import { UpgradeCard, UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { upgradeFactory, useFactory } from "@/store/atoms/factories";
import { hasGoldToBuy } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface UpgradesCardProps {
  /**
   * The factory type
   */
  factoryType: FactoryType;
}

export const UpgradesCard = (props: UpgradesCardProps) => {
  const { factoryType } = props;

  const { isUnlocked, isUpgraded, upgradeCost } = useFactory(factoryType);

  const canBuy = hasGoldToBuy(upgradeCost);

  const getText = () => {
    if (!isUnlocked) {
      return "Charter required";
    }
    if (isUpgraded) {
      return <Check />;
    }
    return (
      <>
        <span>Improve</span>
        <Badge className="font-number normal-case" variant="default">
          <NumberText>{amountFormatter(upgradeCost)}</NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      canAfford={isUnlocked && !isUpgraded && canBuy}
      factoryType={factoryType}
      image={`/images/upgrades/${factoryType}.webp`}
      isComplete={isUpgraded}
      type="upgrade"
    >
      <UpgradeCardTrigger
        disabled={!(isUnlocked && canBuy)}
        onClick={() => upgradeFactory(factoryType)}
      >
        {getText()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
