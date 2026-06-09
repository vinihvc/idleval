import React from "react";
import { NumberText } from "@/components/ui/number-text";
import {
  getSealedState,
  getUpgradeCardCostStyle,
  UpgradeCard,
  UpgradeCardArt,
  UpgradeCardHeader,
  UpgradeCardPanel,
  UpgradeCardSeal,
} from "@/components/ui/upgrade-card";
import type { FactoryType } from "@/content/factories";
import { canPurchaseManager } from "@/game/factories";
import { m } from "@/i18n/messages";
import { sound } from "@/providers/sound";
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
  const sealed = getSealedState({ complete, locked, affordable });
  const descriptionId = React.useId();

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

  const costNode = complete ? undefined : (
    <NumberText
      className={costStyle.className}
      size="md"
      variant={costStyle.variant}
    >
      {amountFormatter(managerCost)}
    </NumberText>
  );

  return (
    <UpgradeCard
      aria-describedby={manager.description ? descriptionId : undefined}
      aria-disabled={complete || !canBuy || undefined}
      aria-label={getAriaLabel()}
      data-affordable={affordable}
      data-complete={complete}
      data-locked={locked}
      data-masked={sealed !== null}
      data-sealed={sealed ?? undefined}
      greenFrame={sealed === "open" || complete}
      interactive={canBuy && isUnlocked && !complete}
      onClick={
        canBuy && isUnlocked
          ? () => {
              sound.play("upgrade");
              autoFactory(factoryType);
              onPurchase?.(manager.name);
            }
          : undefined
      }
    >
      <UpgradeCardPanel
        charter={sealed === "charter"}
        complete={complete}
        open={sealed === "open"}
      >
        {complete && (
          <UpgradeCardHeader
            icon={`/images/factories/${factoryType}.webp`}
            title={manager.name}
          />
        )}
        <UpgradeCardArt
          complete={complete}
          open={sealed === "open"}
          showImage={complete || sealed === "charter"}
          src={`/images/managers/${factoryType}.webp`}
        >
          {sealed && (
            <UpgradeCardSeal
              cost={costNode}
              icon={`/images/factories/${factoryType}.webp`}
              open={sealed === "open"}
              sealed={sealed}
            />
          )}
        </UpgradeCardArt>
      </UpgradeCardPanel>
    </UpgradeCard>
  );
};
