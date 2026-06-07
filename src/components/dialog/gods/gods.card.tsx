import { Trans } from "@lingui/react/macro";
import { CheckboxOn } from "pixelarticons/react";
import { Badge } from "@/components/ui/badge";
import { NumberText } from "@/components/ui/number-text";
import { UpgradeCard, UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import { type God, getGodIndex } from "@/content/gods";
import {
  canInvokeGodAtIndex,
  getGodCardStatus,
  getGodGoldRequired,
} from "@/game/gods";
import { useLocalizedGod } from "@/hooks/use-localized-god";
import { useGods } from "@/store/atoms/gods";
import { useWallet } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";
import { GodConfirmButton } from "./gods.confirm-button";

interface GodsCardProps {
  god: God;
  onInvoke?: () => void;
}

export const GodsCard = (props: GodsCardProps) => {
  const { god, onInvoke } = props;
  const localizedGod = useLocalizedGod(god);

  const { count: godsLevel } = useGods();
  const { gold } = useWallet();

  const godIndex = getGodIndex(god);
  const goldRequired = getGodGoldRequired(godIndex);
  const status = getGodCardStatus(godIndex, godsLevel);
  const canAfford = canInvokeGodAtIndex(godIndex, godsLevel, gold);

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
        return (
          <span>
            <Trans>Await prior god</Trans>
          </span>
        );
      }
      return (
        <span>
          <Trans>Locked</Trans>
        </span>
      );
    }

    return (
      <>
        <span>
          <Trans>Invoke</Trans>
        </span>
        <Badge className="font-number" variant="default">
          <NumberText variant="default">
            {amountFormatter(goldRequired)}
          </NumberText>
        </Badge>
      </>
    );
  };

  return (
    <UpgradeCard
      affordable={affordable}
      complete={complete}
      description={localizedGod.description}
      image={god.image}
      title={localizedGod.name}
    >
      {isNextInvocation && canAfford ? (
        <GodConfirmButton
          disabled={!actionable}
          god={localizedGod}
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
