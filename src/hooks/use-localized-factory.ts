import { useLingui } from "@lingui/react";
import { FACTORY_DATA } from "@/content/factories.data";
import {
  FACTORY_MESSAGES,
  type LocalizedFactory,
  type LocalizedLore,
} from "@/content/factories.messages";
import type { FactoryType } from "@/content/factories.types";

const localizeLore = (
  i18n: ReturnType<typeof useLingui>["i18n"],
  lore: (typeof FACTORY_MESSAGES)[FactoryType]["manager"]
): LocalizedLore => ({
  name: i18n._(lore.name),
  description: i18n._(lore.description),
});

export const useLocalizedFactory = (factory: FactoryType): LocalizedFactory => {
  const { i18n } = useLingui();
  const messages = FACTORY_MESSAGES[factory];

  return {
    name: i18n._(messages.name),
    description: i18n._(messages.description),
    manager: localizeLore(i18n, messages.manager),
    upgrade: localizeLore(i18n, messages.upgrade),
  };
};

export const useLocalizedFactoryName = (factory: FactoryType): string => {
  const { i18n } = useLingui();

  return i18n._(FACTORY_MESSAGES[factory].name);
};

export const getFactoryData = (factory: FactoryType) => FACTORY_DATA[factory];
