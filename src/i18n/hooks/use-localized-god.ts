import { type GodId, getLocalizedGod, type LocalizedGod } from "@/content/gods";
import { useLocale } from "@/i18n/provider";

export const useLocalizedGod = (godId: GodId): LocalizedGod => {
  useLocale();

  return getLocalizedGod(godId);
};

export type { LocalizedGod };
