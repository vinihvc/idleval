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
import { canPurchaseUpgrade } from "@/game/factories";
import { m } from "@/i18n/messages";
import { upgradeFactory, useFactory } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface UpgradesCardProps {
  factoryType: FactoryType;
}

export const UpgradesCard = (props: UpgradesCardProps) => {
  const { factoryType } = props;

  const { isUpgraded, isUnlocked, upgradeCost, upgrade, name } =
    useFactory(factoryType);
  const { gold } = useWallet();

  const complete = isUpgraded;
  const canBuy = canPurchaseUpgrade({
    isUnlocked,
    isUpgraded,
    gold,
    cost: upgradeCost,
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
        <span>{m["ui.upgrades.improve"]()}</span>
        <Badge variant="default">
          <NumberText variant="default">
            {amountFormatter(upgradeCost)}
          </NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      affordable={affordable}
      complete={complete}
      description={upgrade.description}
      image={`/images/upgrades/${factoryType}.webp`}
      title={upgrade.name}
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
        onClick={() => upgradeFactory(factoryType)}
        sound="upgrade"
        variant={actionable ? "green" : "brown"}
      >
        {getTriggerContent()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
