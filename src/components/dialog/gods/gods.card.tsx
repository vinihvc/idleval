import { NumberText } from "@/components/ui/number-text";
import {
  getUpgradeCardCostStyle,
  UpgradeCard,
} from "@/components/ui/upgrade-card";
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
  const affordable = !complete && canAfford;
  const costStyle = getUpgradeCardCostStyle({
    affordable,
    locked: false,
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

  return (
    <UpgradeCard
      affordable={affordable}
      aria-label={getAriaLabel()}
      complete={complete}
      cost={
        complete ? undefined : (
          <NumberText
            className={costStyle.className}
            size="md"
            variant={costStyle.variant}
          >
            {amountFormatter(goldRequired)}
          </NumberText>
        )
      }
      description={localizedGod.description}
      disabled={complete || !canAfford}
      holdLabel={m["ui.common.hold"]()}
      icon={god.icon}
      image={god.image}
      onHoldComplete={
        affordable
          ? () => {
              if (invokeGod(godIndex)) {
                onInvoke?.(localizedGod.name);
              }
            }
          : undefined
      }
      title={localizedGod.name}
    />
  );
};
