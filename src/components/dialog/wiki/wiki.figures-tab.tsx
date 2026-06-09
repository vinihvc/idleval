import { FACTORY_TYPES, getLocalizedFactory } from "@/content/factories";
import { isWikiFigureUnlocked } from "@/game/wiki";
import { translate } from "@/i18n/localize";
import { useLocale } from "@/i18n/provider";
import { useFactories } from "@/store/atoms/factories";
import { type WikiCatalogItem, WikiCatalogTab } from "./wiki.catalog-tab";

export const WikiFiguresTab = () => {
  useLocale();
  const factories = useFactories();

  const items: WikiCatalogItem[] = FACTORY_TYPES.map((factoryType) => {
    const localizedFactory = getLocalizedFactory(factoryType);
    const manager = localizedFactory.manager;

    return {
      id: factoryType,
      title: manager.name,
      flavor: manager.description,
      lore: translate(`wiki.factory.${factoryType}.manager.lore`),
      mechanics: translate(`wiki.factory.${factoryType}.manager.mechanics`),
      image: `/images/managers/${factoryType}.webp`,
      icon: `/images/factories/${factoryType}.webp`,
      unlocked: isWikiFigureUnlocked(factories[factoryType]),
    };
  });

  return <WikiCatalogTab items={items} />;
};
