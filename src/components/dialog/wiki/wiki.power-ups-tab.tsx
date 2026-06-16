import {
  getLocalizedPowerUp,
  getLocalizedPowerUpWikiMechanics,
  POWER_UP_DATA,
  POWER_UP_TYPES,
} from "@/content/power-ups";
import { translate } from "@/i18n/localize";
import { useLocale } from "@/i18n/provider";
import { type WikiCatalogItem, WikiCatalogTab } from "./wiki.catalog-tab";

export const WikiPowerUpsTab = () => {
  useLocale();

  const items: WikiCatalogItem[] = POWER_UP_TYPES.map((powerUpId) => {
    const localizedPowerUp = getLocalizedPowerUp(powerUpId);

    return {
      id: powerUpId,
      title: localizedPowerUp.name,
      flavor: localizedPowerUp.description,
      lore: translate(`wiki.powerup.${powerUpId}.lore`),
      mechanics: getLocalizedPowerUpWikiMechanics(powerUpId),
      image: POWER_UP_DATA[powerUpId].image,
    };
  });

  return <WikiCatalogTab items={items} />;
};
