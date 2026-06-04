import { Provider as JotaiProvider } from "jotai";
import { Soundtrack } from "@/components/sound/soundtrack";
import { SoundProvider } from "@/components/ui/sound";
import { store } from "@/store";

export const Providers = ({ children }: React.PropsWithChildren) => (
  <SoundProvider>
    <JotaiProvider store={store}>
      {children}

      <Soundtrack />
    </JotaiProvider>
  </SoundProvider>
);
