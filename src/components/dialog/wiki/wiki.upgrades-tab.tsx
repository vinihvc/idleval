import { FACTORY_TYPES, getLocalizedFactory } from "@/content/factories";
import { isWikiUpgradeUnlocked } from "@/game/wiki";
import { translate } from "@/i18n/localize";
import { useLocale } from "@/i18n/provider";
import { useFactories } from "@/store/atoms/factories";
import { type WikiCatalogItem, WikiCatalogTab } from "./wiki.catalog-tab";

export const WikiUpgradesTab = () => {
  useLocale();
  const factories = useFactories();

  const items: WikiCatalogItem[] = FACTORY_TYPES.map((factoryType) => {
    const localizedFactory = getLocalizedFactory(factoryType);
    const upgrade = localizedFactory.upgrade;

    return {
      id: factoryType,
      title: upgrade.name,
      flavor: upgrade.description,
      lore: translate(`wiki.factory.${factoryType}.upgrade.lore`),
      mechanics: translate(`wiki.factory.${factoryType}.upgrade.mechanics`),
      image: `/images/upgrades/${factoryType}.webp`,
      icon: `/images/factories/${factoryType}.webp`,
      unlocked: isWikiUpgradeUnlocked(factories[factoryType]),
    };
  });

  return <WikiCatalogTab items={items} />;
};
