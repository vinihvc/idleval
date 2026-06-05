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

  const { isUnlocked, isUpgraded, upgradeCost, upgrade, name } =
    useFactory(factoryType);

  const canBuy = hasGoldToBuy(upgradeCost);
  const lore = upgrade;
  const affordable = isUnlocked && !isUpgraded && canBuy;
  const actionable = isUpgraded || affordable;

  const getText = () => {
    if (!isUnlocked) {
      return "Charter required";
    }
    if (isUpgraded) {
      return <CheckboxOn />;
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
      affordable={affordable}
      complete={isUpgraded}
      description={lore.description}
      image={`/images/upgrades/${factoryType}.webp`}
      title={lore.name}
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
        disabled={!(isUnlocked && canBuy)}
        onClick={() => upgradeFactory(factoryType)}
        sound="upgrade"
        variant={actionable ? "green" : "brown"}
      >
        {getText()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
