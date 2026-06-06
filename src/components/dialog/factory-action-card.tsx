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
import { useFactory } from "@/store/atoms/factories";
import { hasGoldToBuy } from "@/store/atoms/wallet";
import type { GameValue } from "@/utils/decimal";
import { amountFormatter } from "@/utils/formatters";

interface FactoryActionCardProps {
  actionLabel: string;
  cost: GameValue;
  factoryType: FactoryType;
  imagePath: string;
  isComplete: boolean;
  lore: {
    description: string;
    name: string;
  };
  onAction: () => void;
}

export const FactoryActionCard = (props: FactoryActionCardProps) => {
  const {
    actionLabel,
    cost,
    factoryType,
    imagePath,
    isComplete,
    lore,
    onAction,
  } = props;

  const { isUnlocked, name } = useFactory(factoryType);

  const canBuy = hasGoldToBuy(cost);
  const affordable = isUnlocked && !isComplete && canBuy;
  const actionable = isComplete || affordable;

  const getText = () => {
    if (!isUnlocked) {
      return "Charter required";
    }
    if (isComplete) {
      return <CheckboxOn />;
    }
    return (
      <>
        <span>{actionLabel}</span>
        <Badge className="font-number normal-case" variant="default">
          <NumberText>{amountFormatter(cost)}</NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      affordable={affordable}
      complete={isComplete}
      description={lore.description}
      image={imagePath}
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
        onClick={onAction}
        sound="upgrade"
        variant={actionable ? "green" : "brown"}
      >
        {getText()}
      </UpgradeCardTrigger>
    </UpgradeCard>
  );
};
