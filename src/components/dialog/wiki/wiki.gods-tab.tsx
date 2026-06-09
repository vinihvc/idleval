import { GOD_DATA } from "@/content/gods";
import { isWikiGodUnlocked } from "@/game/wiki";
import { translate } from "@/i18n/localize";
import { useLocale } from "@/i18n/provider";
import { useGods } from "@/store/atoms/gods";
import { type WikiCatalogItem, WikiCatalogTab } from "./wiki.catalog-tab";

export const WikiGodsTab = () => {
  useLocale();
  const { invoked } = useGods();

  const items: WikiCatalogItem[] = GOD_DATA.map((god, godIndex) => ({
    id: god.id,
    title: translate(`god.${god.id}.name`),
    flavor: translate(`god.${god.id}.description`),
    lore: translate(`wiki.god.${god.id}.lore`),
    mechanics: translate(`wiki.god.${god.id}.mechanics`),
    image: god.image,
    icon: god.icon,
    unlocked: isWikiGodUnlocked(godIndex, invoked),
  }));

  return <WikiCatalogTab items={items} />;
};
