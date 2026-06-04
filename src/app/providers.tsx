import { Provider as JotaiProvider } from "jotai";
import { SoundProvider } from "@/components/ui/sound";
import { store } from "@/store/store";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <SoundProvider>
    <JotaiProvider store={store}>{children}</JotaiProvider>
  </SoundProvider>
);
