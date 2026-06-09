import { NumberText } from "@/components/ui/number-text";
import {
  getUpgradeCardCostStyle,
  UpgradeCard,
} from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { canPurchaseUpgrade } from "@/game/factories";
import { m } from "@/i18n/messages";
import { upgradeFactory, useFactory } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface UpgradesCardProps {
  factoryType: FactoryType;
  onPurchase?: (name: string) => void;
}

export const UpgradesCard = (props: UpgradesCardProps) => {
  const { factoryType, onPurchase } = props;

  const { isUpgraded, isUnlocked, upgradeCost, upgrade } =
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
  const locked = !isUnlocked;

  const getAriaLabel = () => {
    if (complete) {
      return m["ui.common.completed"]({ 0: upgrade.name });
    }

    if (locked) {
      return `${upgrade.name}. ${m["ui.common.charterRequired"]()}`;
    }

    if (!canBuy) {
      return m["ui.common.insufficientGold"]({ 0: upgrade.name });
    }

    return `${m["ui.upgrades.improve"]()} ${upgrade.name}`;
  };

  const costStyle = getUpgradeCardCostStyle({ affordable, locked });

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
            {amountFormatter(upgradeCost)}
          </NumberText>
        )
      }
      description={upgrade.description}
      disabled={complete || !canBuy}
      icon={`/images/factories/${factoryType}.webp`}
      image={`/images/upgrades/${factoryType}.webp`}
      locked={locked}
      onClick={
        canBuy && isUnlocked
          ? () => {
              upgradeFactory(factoryType);
              onPurchase?.(upgrade.name);
            }
          : undefined
      }
      sound="upgrade"
      title={upgrade.name}
    />
  );
};
