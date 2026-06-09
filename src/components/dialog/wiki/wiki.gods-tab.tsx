import { GOD_DATA } from "@/content/gods";
import { translate } from "@/i18n/localize";
import { useLocale } from "@/i18n/provider";
import { type WikiCatalogItem, WikiCatalogTab } from "./wiki.catalog-tab";

export const WikiGodsTab = () => {
  useLocale();

  const items: WikiCatalogItem[] = GOD_DATA.map((god) => ({
    id: god.id,
    title: translate(`god.${god.id}.name`),
    flavor: translate(`god.${god.id}.description`),
    lore: translate(`wiki.god.${god.id}.lore`),
    mechanics: translate(`wiki.god.${god.id}.mechanics`),
    image: god.image,
    icon: god.icon,
  }));

  return <WikiCatalogTab items={items} />;
};
