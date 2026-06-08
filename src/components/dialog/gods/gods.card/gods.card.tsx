import { CheckboxOn } from "pixelarticons/react";
import { Badge } from "@/components/ui/badge";
import { HoldButton } from "@/components/ui/hold-button";
import { NumberText } from "@/components/ui/number-text";
import { UpgradeCard, UpgradeCardTrigger } from "@/components/ui/upgrade-card";
import { type GodType, getGod } from "@/content/gods";
import {
  canInvokeGodAtIndex,
  getGodCardStatus,
  getGodGoldRequired,
} from "@/game/gods";
import { useLocalizedGod } from "@/i18n/hooks/use-localized-god";
import { m } from "@/i18n/messages";
import { invokeGod, useGods } from "@/store/atoms/gods";
import { useWallet } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface GodsCardProps {
  god: GodType;
  onInvoke?: () => void;
}

export const GodsCard = (props: GodsCardProps) => {
  const { god, onInvoke } = props;
  const localizedGod = useLocalizedGod(god.id);

  const { invoked } = useGods();
  const { gold } = useWallet();

  const godIndex = getGod(god);
  const goldRequired = getGodGoldRequired(godIndex);
  const status = getGodCardStatus(godIndex, invoked);
  const canAfford = canInvokeGodAtIndex(godIndex, invoked, gold);

  const complete = status === "completed";
  const affordable = !complete && canAfford;
  const actionable = complete || affordable;

  const getButtonLabel = () => {
    if (complete) {
      return <CheckboxOn />;
    }

    return (
      <>
        <span>{m["ui.gods.invoke"]()}</span>
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
      {affordable ? (
        <HoldButton
          aria-label={m["ui.gods.holdToInvoke"]({ 0: localizedGod.name })}
          className="inset-shadow-none w-full rounded-none rounded-b-md border"
          holdLabel={m["ui.common.hold"]()}
          onHoldComplete={() => {
            if (invokeGod(godIndex)) {
              onInvoke?.();
            }
          }}
          variant="green"
        >
          {getButtonLabel()}
        </HoldButton>
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
