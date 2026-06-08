import { Image } from "@unpic/react";
import { CheckboxOn } from "pixelarticons/react/CheckboxOn";
import { Badge } from "@/components/ui/badge";
import { NumberText } from "@/components/ui/number-text";
import {
  UpgradeCard,
  UpgradeCardBadge,
  UpgradeCardTrigger,
} from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { canPurchaseManager } from "@/game/factories";
import { m } from "@/i18n/messages";
import { autoFactory, useFactory } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface ManagersCardProps {
  factoryType: FactoryType;
}

export const ManagersCard = (props: ManagersCardProps) => {
  const { factoryType } = props;

  const { isAutomated, isUnlocked, managerCost, manager, name } =
    useFactory(factoryType);
  const { gold } = useWallet();

  const complete = isAutomated;
  const canBuy = canPurchaseManager({
    isUnlocked,
    isAutomated,
    gold,
    cost: managerCost,
  });
  const affordable = !complete && canBuy;
  const actionable = complete || affordable;
  const isDisabled = complete || !canBuy;

  const getTriggerContent = () => {
    if (!isUnlocked) {
      return m["ui.common.charterRequired"]();
    }
    if (complete) {
      return <CheckboxOn />;
    }
    return (
      <>
        <span>{m["ui.managers.appoint"]()}</span>
        <Badge variant="default">
          <NumberText variant="default">
            {amountFormatter(managerCost)}
          </NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      affordable={affordable}
      complete={complete}
      description={manager.description}
      image={`/images/managers/${factoryType}.webp`}
      title={manager.name}
    >
      <UpgradeCardBadge
        icon={
          <Image
            alt=""
            aria-hidden
            className="pixel-crisp pointer-events-none size-full rounded-md object-contain"
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
        disabled={isDisabled}
        onClick={() => autoFactory(factoryType)}
        sound="upgrade"
        variant={actionable ? "green" : "brown"}
      >
        {getTriggerContent()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
