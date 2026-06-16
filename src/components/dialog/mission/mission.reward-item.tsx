import { Image } from "@unpic/react";
import { Crown } from "pixelarticons/react/Crown";
import { Coin } from "@/components/icons/coin";
import { FormattedNumber } from "@/components/ui/formatted-number";
import type { MissionReward } from "@/content/missions";
import { getLocalizedPowerUp, POWER_UP_DATA } from "@/content/power-ups";
import { translate, translateParams } from "@/i18n/localize";
import { m } from "@/i18n/messages";
import { D } from "@/utils/decimal";
import { amountFormatterWithDolarSign } from "@/utils/formatters";

interface MissionRewardItemProps {
  reward: MissionReward;
}

export const MissionRewardItem = (props: MissionRewardItemProps) => {
  const { reward } = props;

  switch (reward.type) {
    case "gold":
      return (
        <MissionRewardListItem>
          <span className="flex items-center gap-1.5">
            <span className="sr-only">
              {getGoldRewardAriaLabel(reward.amount)}
            </span>
            <span aria-hidden className="flex items-center gap-1.5">
              <span className="flex w-6 shrink-0 items-center justify-center sm:w-7">
                <Coin className="size-4 sm:size-5" intrinsicSize={20} />
              </span>
              <FormattedNumber isDollar value={D(reward.amount)} />
            </span>
          </span>
        </MissionRewardListItem>
      );
    case "powerUp": {
      const count = reward.count ?? 1;
      const localizedPowerUp = getLocalizedPowerUp(reward.powerUpId);
      const powerUpIconSize = 24;

      return (
        <MissionRewardListItem>
          <span className="flex items-center gap-1.5">
            <span className="sr-only">
              {m["ui.missions.reward.powerUp"]({
                count: String(count),
                name: localizedPowerUp.name,
              })}
            </span>
            <span
              aria-hidden
              className="flex w-6 shrink-0 items-center justify-center sm:w-7"
            >
              <Image
                alt=""
                className="pixel-crisp size-5 object-contain sm:size-6"
                height={powerUpIconSize}
                layout="constrained"
                src={POWER_UP_DATA[reward.powerUpId].image}
                width={powerUpIconSize}
              />
            </span>
            <span aria-hidden className="inline-flex items-center gap-1.5">
              <span>{localizedPowerUp.name}</span>
              <span className="text-muted">
                {translateParams("ui.missions.reward.powerUpQuantity", {
                  count: String(count),
                })}
              </span>
            </span>
          </span>
        </MissionRewardListItem>
      );
    }
    case "renown":
      return (
        <MissionRewardListItem>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="flex w-6 shrink-0 items-center justify-center sm:w-7"
            >
              <Crown className="size-4 sm:size-5" />
            </span>
            <span>
              {m["ui.missions.reward.renown"]({
                percent: String(reward.percent),
              })}
            </span>
          </span>
        </MissionRewardListItem>
      );
    default: {
      const exhaustiveCheck: never = reward;
      return exhaustiveCheck;
    }
  }
};

const getGoldRewardAriaLabel = (amount: string): string =>
  `${amountFormatterWithDolarSign(D(amount))} ${translate("mission.objective.goldLabel")}`;

const MissionRewardListItem = (props: React.PropsWithChildren) => (
  <li className="flex items-center gap-2">
    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-muted" />
    {props.children}
  </li>
);
