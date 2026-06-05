import { Image } from "@unpic/react";
import { CheckboxOn } from "pixelarticons/react";
import { Badge } from "@/components/ui/badge";
import { NumberText } from "@/components/ui/number-text";
import {
  UpgradeCard,
  UpgradeCardBadge,
  UpgradeCardTrigger,
} from "@/components/ui/upgrade-card";
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

  const { isUnlocked, isAutomated, managerCost, manager, name } =
    useFactory(factoryType);

  const canBuy = hasGoldToBuy(managerCost);
  const lore = manager;
  const affordable = isUnlocked && !isAutomated && canBuy;
  const actionable = isAutomated || affordable;

  const getText = () => {
    if (!isUnlocked) {
      return "Charter required";
    }
    if (isAutomated) {
      return <CheckboxOn />;
    }
    return (
      <>
        <span>Appoint</span>
        <Badge className="font-number normal-case" variant="default">
          <NumberText>{amountFormatter(managerCost)}</NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      affordable={affordable}
      complete={isAutomated}
      description={lore.description}
      image={`/images/managers/${factoryType}.webp`}
      title={lore.name}
    >
      <UpgradeCardBadge
        icon={
          <Image
            alt=""
            aria-hidden
            className="pixel-crisp pointer-events-none size-full rounded-md object-cover"
            height={28}
            layout="constrained"
            src={`/images/factories/${factoryType}.webp`}
            width={28}
          />
        }
      >
        {name}
      </UpgradeCardBadge>
      <UpgradeCardTrigger
        disabled={!(isUnlocked && canBuy)}
        onClick={() => autoFactory(factoryType)}
        sound="upgrade"
        variant={actionable ? "green" : "brown"}
      >
        {getText()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
