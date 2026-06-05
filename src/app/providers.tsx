import { OfflineBootstrap } from "@/providers/offline-bootstrap";
import { SoundProvider } from "@/providers/sound";
import { StoreProvider } from "@/providers/store";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <SoundProvider>
    <StoreProvider>
      <OfflineBootstrap>{children}</OfflineBootstrap>
    </StoreProvider>
  </SoundProvider>
);
