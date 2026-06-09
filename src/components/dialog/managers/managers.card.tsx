import { NumberText } from "@/components/ui/number-text";
import {
  getUpgradeCardCostStyle,
  UpgradeCard,
} from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { canPurchaseManager } from "@/game/factories";
import { m } from "@/i18n/messages";
import { autoFactory, useFactory } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";
import { amountFormatter } from "@/utils/formatters";

interface ManagersCardProps {
  factoryType: FactoryType;
  onPurchase?: (name: string) => void;
}

export const ManagersCard = (props: ManagersCardProps) => {
  const { factoryType, onPurchase } = props;

  const { isAutomated, isUnlocked, managerCost, manager } =
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
  const locked = !isUnlocked;

  const getAriaLabel = () => {
    if (complete) {
      return m["ui.common.completed"]({ 0: manager.name });
    }

    if (locked) {
      return `${manager.name}. ${m["ui.common.charterRequired"]()}`;
    }

    if (!canBuy) {
      return m["ui.common.insufficientGold"]({ 0: manager.name });
    }

    return `${m["ui.managers.appoint"]()} ${manager.name}`;
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
            {amountFormatter(managerCost)}
          </NumberText>
        )
      }
      description={manager.description}
      disabled={complete || !canBuy}
      icon={`/images/factories/${factoryType}.webp`}
      image={`/images/managers/${factoryType}.webp`}
      locked={locked}
      onClick={
        canBuy && isUnlocked
          ? () => {
              autoFactory(factoryType);
              onPurchase?.(manager.name);
            }
          : undefined
      }
      sound="upgrade"
      title={manager.name}
    />
  );
};
