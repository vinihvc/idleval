import { CheckboxOn } from "pixelarticons/react";
import { Badge } from "@/components/ui/badge";
import { NumberText } from "@/components/ui/number-text";
import { UpgradeCard, UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import { GODS } from "@/content/gods";
import { getGodGoldRequired } from "@/game/gods";
import { useGods } from "@/store/atoms/gods";
import { hasGoldToBuy } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";
import { GodConfirmButton } from "./god-confirm";

interface GodsCardProps {
  godIndex: number;
  onInvoke?: () => void;
}

export const GodsCard = (props: GodsCardProps) => {
  const { godIndex, onInvoke } = props;

  const { count: godsLevel } = useGods();

  const god = GODS[godIndex];
  const goldRequired = getGodGoldRequired(godIndex);
  const canAfford = hasGoldToBuy(goldRequired);

  const getCardStatus = () => {
    if (godIndex < godsLevel) {
      return "completed" as const;
    }
    if (godIndex === godsLevel) {
      return "available" as const;
    }
    if (godIndex === godsLevel + 1) {
      return "locked" as const;
    }
    return "future" as const;
  };

  const status = getCardStatus();
  const isNextInvocation = godIndex === godsLevel;
  const complete = status === "completed";
  const affordable = status === "available" && canAfford;
  const actionable = complete || affordable;

  const getButtonLabel = () => {
    if (status === "completed") {
      return <CheckboxOn />;
    }

    if (!isNextInvocation) {
      if (status === "future") {
        return <span>Await prior god</span>;
      }
      return <span>Locked</span>;
    }

    return (
      <>
        <span>Invoke</span>
        <Badge className="font-number normal-case" variant="default">
          <NumberText>{amountFormatter(goldRequired)}</NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      affordable={affordable}
      complete={complete}
      description={god.description}
      image={god.image}
      title={god.name}
    >
      {isNextInvocation && canAfford ? (
        <GodConfirmButton
          disabled={!actionable}
          god={god}
          godIndex={godIndex}
          onInvoke={onInvoke}
          sound="click"
          variant="green"
        >
          {getButtonLabel()}
        </GodConfirmButton>
      ) : (
        <UpgradeCardTrigger
          disabled={!actionable}
          sound="click"
          variant={actionable ? "green" : "brown"}
        >
          {getButtonLabel()}
        </UpgradeCardTrigger>
      )}
    </UpgradeCard>
  );
};
