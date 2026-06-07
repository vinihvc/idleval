import { OfflineBootstrap } from "@/providers/offline-bootstrap";
import { ProductionScheduler } from "@/providers/production-scheduler";
import { SoundProvider } from "@/providers/sound";
import { StoreProvider } from "@/providers/store";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <StoreProvider>
    <SoundProvider>
      <ProductionScheduler>
        <OfflineBootstrap>{children}</OfflineBootstrap>
      </ProductionScheduler>
    </SoundProvider>
  </StoreProvider>
);
