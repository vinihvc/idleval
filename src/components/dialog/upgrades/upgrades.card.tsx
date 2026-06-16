import React from "react";
import { NumberText } from "@/components/ui/number-text";
import {
  UpgradeCard,
  UpgradeCardArt,
  UpgradeCardHeader,
  UpgradeCardPanel,
  UpgradeCardSeal,
} from "@/components/ui/upgrade-card";
import { useUpgradeCardAffordance } from "@/components/ui/upgrade-card/use-upgrade-card-affordance";
import type { FactoryType } from "@/content/factories";
import { m } from "@/i18n/messages";
import type { GameValue } from "@/utils/decimal";
import { amountFormatter } from "@/utils/formatters";

export interface UpgradesCardProps {
  canBuy: boolean;
  complete: boolean;
  description?: string;
  factoryType: FactoryType;
  locked: boolean;
  name: string;
  onPurchase?: () => void;
  upgradeCost: number | GameValue;
}

export const UpgradesCard = (props: UpgradesCardProps) => {
  const {
    factoryType,
    name,
    description,
    complete,
    locked,
    canBuy,
    upgradeCost,
    onPurchase,
  } = props;

  const { sealed, costStyle, interactive, variant, dataAttributes } =
    useUpgradeCardAffordance({
      complete,
      locked,
      canAfford: canBuy,
    });
  const descriptionId = React.useId();

  const getAriaLabel = () => {
    if (complete) {
      return m["ui.common.completed"]({ 0: name });
    }

    if (locked) {
      return `${name}. ${m["ui.common.charterRequired"]()}`;
    }

    if (!canBuy) {
      return m["ui.common.insufficientGold"]({ 0: name });
    }

    return `${m["ui.upgrades.improve"]()} ${name}`;
  };

  const costNode = complete ? undefined : (
    <NumberText
      className={costStyle.className}
      size="md"
      variant={costStyle.variant}
    >
      {amountFormatter(upgradeCost)}
    </NumberText>
  );

  return (
    <UpgradeCard
      aria-describedby={description ? descriptionId : undefined}
      aria-disabled={complete || !canBuy || undefined}
      aria-label={getAriaLabel()}
      {...dataAttributes}
      interactive={interactive}
      onClick={canBuy && !locked ? onPurchase : undefined}
      variant={variant}
    >
      <UpgradeCardPanel
        charter={sealed === "charter"}
        complete={complete}
        open={sealed === "open"}
      >
        {description && (
          <span className="sr-only" id={descriptionId}>
            {description}
          </span>
        )}
        {complete && (
          <UpgradeCardHeader
            description={description}
            icon={`/images/factories/${factoryType}.webp`}
            title={name}
          />
        )}
        <UpgradeCardArt
          complete={complete}
          open={sealed === "open"}
          showImage={complete || sealed === "charter"}
          src={`/images/upgrades/${factoryType}.webp`}
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
