import React from "react";
import { NumberText } from "@/components/ui/number-text";
import {
  UpgradeCard,
  UpgradeCardArt,
  UpgradeCardHeader,
  UpgradeCardHoldFeedback,
  UpgradeCardPanel,
  UpgradeCardSeal,
} from "@/components/ui/upgrade-card";
import { useUpgradeCardAffordance } from "@/components/ui/upgrade-card/use-upgrade-card-affordance";
import { type GodType, getGod } from "@/content/gods";
import {
  canInvokeGodAtIndex,
  getGodCardStatus,
  getGodGoldRequired,
} from "@/game/gods";
import { useHoldPress } from "@/hooks/use-hold-press";
import { useLocalizedGod } from "@/i18n/hooks/use-localized-god";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { invokeGod, useGods } from "@/store/atoms/gods";
import { useWallet } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface GodsCardProps {
  god: GodType;
  onInvoke?: (name: string) => void;
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
  const affordance = useUpgradeCardAffordance({
    complete,
    locked: false,
    canAfford,
  });
  const { affordable, sealed, costStyle, variant, dataAttributes } = affordance;
  const descriptionId = React.useId();

  const { isHolding, holdHandlers } = useHoldPress({
    disabled: complete || !canAfford,
    onHoldComplete: affordable
      ? () => {
          if (invokeGod(godIndex)) {
            onInvoke?.(localizedGod.name);
          }
        }
      : undefined,
  });

  const getAriaLabel = () => {
    if (complete) {
      return m["ui.common.completed"]({ 0: localizedGod.name });
    }

    if (!canAfford) {
      return m["ui.common.insufficientGold"]({ 0: localizedGod.name });
    }

    if (affordable) {
      return m["ui.gods.holdToInvoke"]({ 0: localizedGod.name });
    }

    return localizedGod.name;
  };

  const costNode = complete ? undefined : (
    <NumberText
      className={costStyle.className}
      size="md"
      variant={costStyle.variant}
    >
      {amountFormatter(goldRequired)}
    </NumberText>
  );

  const isHoldCard = affordable && !complete;

  return (
    <UpgradeCard
      {...(isHoldCard ? holdHandlers : {})}
      aria-busy={isHolding || undefined}
      aria-describedby={localizedGod.description ? descriptionId : undefined}
      aria-disabled={complete || !canAfford || undefined}
      aria-label={getAriaLabel()}
      className={cn(
        isHoldCard &&
          "touch-manipulation select-none [-webkit-touch-callout:none]"
      )}
      {...dataAttributes}
      interactive={affordable}
      onClick={isHoldCard ? holdHandlers.onClick : undefined}
      variant={variant}
    >
      <UpgradeCardPanel
        charter={sealed === "charter"}
        complete={complete}
        open={sealed === "open"}
      >
        {localizedGod.description && (
          <span className="sr-only" id={descriptionId}>
            {localizedGod.description}
          </span>
        )}
        {complete && (
          <UpgradeCardHeader
            description={localizedGod.description}
            icon={god.icon}
            title={localizedGod.name}
          />
        )}
        <UpgradeCardArt
          complete={complete}
          open={sealed === "open"}
          showImage={complete || sealed === "charter"}
          src={god.image}
        >
          {sealed && (
            <UpgradeCardSeal
              cost={costNode}
              icon={god.icon}
              open={sealed === "open"}
              sealed={sealed}
            />
          )}
          {isHoldCard && (
            <UpgradeCardHoldFeedback
              active={isHolding}
              label={m["ui.common.hold"]()}
            />
          )}
        </UpgradeCardArt>
      </UpgradeCardPanel>
    </UpgradeCard>
  );
};
