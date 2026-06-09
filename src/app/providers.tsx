import { I18nProvider } from "@/i18n/provider";
import { OfflineEarning } from "@/providers/offline-earning";
import { SoundProvider } from "@/providers/sound";
import { StoreProvider } from "@/providers/store";
import { VariantToolsProvider } from "@/providers/variant-tools";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <StoreProvider>
    <VariantToolsProvider>
      <SoundProvider>
        <OfflineEarning>
          <I18nProvider>{children}</I18nProvider>
        </OfflineEarning>
      </SoundProvider>
    </VariantToolsProvider>
  </StoreProvider>
);
