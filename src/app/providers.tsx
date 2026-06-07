import { I18nProvider } from "@/providers/i18n";
import { OfflineBootstrap } from "@/providers/offline-bootstrap";
import { ProductionScheduler } from "@/providers/production-scheduler";
import { SoundProvider } from "@/providers/sound";
import { StoreProvider } from "@/providers/store";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <StoreProvider>
    <I18nProvider>
      <SoundProvider>
        <ProductionScheduler>
          <OfflineBootstrap>{children}</OfflineBootstrap>
        </ProductionScheduler>
      </SoundProvider>
    </I18nProvider>
  </StoreProvider>
);
