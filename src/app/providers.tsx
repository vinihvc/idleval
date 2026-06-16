import { I18nProvider } from "@/i18n/provider";
import { OfflineEarning } from "@/providers/offline-earning/index";
import { SoundProvider } from "@/providers/sound";
import { StoreProvider } from "@/providers/store";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <StoreProvider>
    <SoundProvider>
      <OfflineEarning>
        <I18nProvider>{children}</I18nProvider>
      </OfflineEarning>
    </SoundProvider>
  </StoreProvider>
);
