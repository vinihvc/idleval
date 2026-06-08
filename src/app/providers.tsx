import { I18nProvider } from "@/i18n/provider";
import { OfflineBootstrap } from "@/providers/offline-bootstrap";
import { ProductionScheduler } from "@/providers/production-scheduler";
import { SoundProvider } from "@/providers/sound";
import { StoreProvider } from "@/providers/store";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <StoreProvider>
    <SoundProvider>
      <ProductionScheduler>
        <OfflineBootstrap>
          <I18nProvider>{children}</I18nProvider>
        </OfflineBootstrap>
      </ProductionScheduler>
    </SoundProvider>
  </StoreProvider>
);
