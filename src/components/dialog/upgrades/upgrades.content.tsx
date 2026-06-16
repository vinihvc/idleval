import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { canPurchaseUpgrade } from "@/game/factories";
import { LiveAnnouncer, useLiveAnnouncer } from "@/hooks/use-live-announcer";
import { m } from "@/i18n/messages";
import { sound } from "@/providers/sound";
import { upgradeFactory, useFactory } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";
import { UpgradesCard } from "./upgrades.card";

export const UpgradesContent = () => {
  const { announce, message } = useLiveAnnouncer();

  return (
    <>
      <LiveAnnouncer message={message} />
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {FACTORY_TYPES.map((factoryType) => (
          <UpgradesCardConnected
            factoryType={factoryType}
            key={factoryType}
            onPurchase={(name) => {
              announce(m["ui.a11y.purchased"]({ name }));
            }}
          />
        ))}
      </div>
    </>
  );
};

interface UpgradesCardConnectedProps {
  factoryType: FactoryType;
  onPurchase?: (name: string) => void;
}

const UpgradesCardConnected = (props: UpgradesCardConnectedProps) => {
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
  const locked = !isUnlocked;

  return (
    <UpgradesCard
      canBuy={canBuy}
      complete={complete}
      description={upgrade.description}
      factoryType={factoryType}
      locked={locked}
      name={upgrade.name}
      onPurchase={
        canBuy && isUnlocked
          ? () => {
              sound.play("upgrade");
              upgradeFactory(factoryType);
              onPurchase?.(upgrade.name);
            }
          : undefined
      }
      upgradeCost={upgradeCost}
    />
  );
};
