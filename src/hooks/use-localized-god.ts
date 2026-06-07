import { useLingui } from "@lingui/react";
import { GOD_MESSAGES, type God, type GodData } from "@/content/gods";

export interface LocalizedGod extends GodData {
  description: string;
  name: string;
}

export const useLocalizedGod = (god: God | GodData): LocalizedGod => {
  const { i18n } = useLingui();
  const messages = GOD_MESSAGES[god.id];

  return {
    ...god,
    name: i18n._(messages.name),
    description: i18n._(messages.description),
  };
};
