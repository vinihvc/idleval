import { Check } from "pixelarticons/react";
import { Badge } from "@/components/ui/badge";
import { NumberText } from "@/components/ui/number-text";
import { UpgradeCard, UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { autoFactory, useFactory } from "@/store/atoms/factories";
import { hasGoldToBuy } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface ManagersCardProps {
  /**
   * The factory type
   */
  factoryType: FactoryType;
}

export const ManagersCard = (props: ManagersCardProps) => {
  const { factoryType } = props;

  const { isUnlocked, isAutomated, automatedCost } = useFactory(factoryType);

  const canBuy = hasGoldToBuy(automatedCost);

  const getText = () => {
    if (!isUnlocked) {
      return "Charter required";
    }
    if (isAutomated) {
      return <Check />;
    }
    return (
      <>
        <span>Appoint</span>
        <Badge className="font-number normal-case" variant="default">
          <NumberText>{amountFormatter(automatedCost)}</NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      canAfford={isUnlocked && !isAutomated && canBuy}
      factoryType={factoryType}
      image={`/images/managers/${factoryType}.webp`}
      isComplete={isAutomated}
      type="manager"
    >
      <UpgradeCardTrigger
        disabled={!(isUnlocked && canBuy)}
        onClick={() => autoFactory(factoryType)}
      >
        {getText()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
