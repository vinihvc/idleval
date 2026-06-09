import { FACTORY_TYPES, getLocalizedFactory } from "@/content/factories";
import { translate } from "@/i18n/localize";
import { useLocale } from "@/i18n/provider";
import { type WikiCatalogItem, WikiCatalogTab } from "./wiki.catalog-tab";

export const WikiUpgradesTab = () => {
  useLocale();

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
    };
  });

  return <WikiCatalogTab items={items} />;
};
