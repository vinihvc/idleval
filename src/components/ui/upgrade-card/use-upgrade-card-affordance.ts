import React from "react";
import {
  getSealedState,
  getUpgradeCardCostStyle,
  type UpgradeCardVariant,
} from "./upgrade-card";

interface UseUpgradeCardAffordanceInput {
  canAfford: boolean;
  complete: boolean;
  locked: boolean;
}

export const useUpgradeCardAffordance = (
  input: UseUpgradeCardAffordanceInput
) => {
  const { complete, locked, canAfford } = input;

  return React.useMemo(() => {
    const affordable = !complete && canAfford;
    const sealed = getSealedState({ complete, locked, affordable });
    const costStyle = getUpgradeCardCostStyle({ affordable, locked });
    const interactive = canAfford && !locked && !complete;
    const variant: UpgradeCardVariant =
      sealed === "open" || complete ? "green" : "brown";

    return {
      affordable,
      sealed,
      costStyle,
      interactive,
      variant,
      dataAttributes: {
        "data-affordable": affordable,
        "data-complete": complete,
        "data-locked": locked,
        "data-masked": sealed !== null,
        "data-sealed": sealed ?? undefined,
      },
    };
  }, [complete, locked, canAfford]);
};
