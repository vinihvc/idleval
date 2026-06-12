import type React from "react";
import { render } from "vitest-browser-react";
import type { AppLocale } from "@/i18n/locale";
import { I18nProvider } from "@/i18n/provider";
import { OfflineEarning } from "@/providers/offline-earning";
import { SoundProvider } from "@/providers/sound";
import { StoreProvider } from "@/providers/store";
import { setLocale } from "@/store/atoms/settings";

interface RenderWithProvidersOptions {
  locale?: AppLocale;
}

export const renderWithProviders = async (
  ui: React.ReactNode,
  options: RenderWithProvidersOptions = {}
) => {
  if (options.locale) {
    setLocale(options.locale);
  }

  return await render(
    <StoreProvider>
      <SoundProvider>
        <OfflineEarning>
          <I18nProvider>{ui}</I18nProvider>
        </OfflineEarning>
      </SoundProvider>
    </StoreProvider>
  );
};
