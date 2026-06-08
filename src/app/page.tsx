import { DebugTools } from "@/components/debug/debug-tools";
import { MediaQuery } from "@/components/debug/media-query";
import { WelcomeDialog } from "@/components/dialog/welcome";
import { Background } from "@/components/layout/background";
import { FactoryGrid } from "@/components/layout/factory-grid";
import { Footer } from "@/components/layout/footer";
import { GamePanel } from "@/components/layout/game-panel";
import { GameShell } from "@/components/layout/game-shell";
import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDisableContextMenu } from "@/hooks/use-context-menu";
import { cn } from "@/lib/cn";
import { IS_DEV } from "@/lib/envs";
import { Providers } from "./providers";

export const HomePage = () => {
  useDisableContextMenu();

  return (
    <Providers>
      <div className="flex w-full flex-col max-sm:min-h-0 max-sm:flex-1 max-sm:overflow-hidden sm:h-auto">
        <Background />

        <GameShell className="max-sm:min-h-0 max-sm:flex-1 sm:h-auto sm:flex-none">
          <GamePanel className={cn({ "select-none": !IS_DEV })}>
            <Header />

            <ScrollArea className="min-h-0 flex-1 sm:h-auto sm:flex-none sm:overflow-visible sm:**:data-[slot=scroll-area-viewport]:h-auto sm:**:data-[slot=scroll-area-viewport]:max-h-none">
              <FactoryGrid />
            </ScrollArea>
          </GamePanel>

          <Navigation />
        </GameShell>

        <Footer />
      </div>

      <WelcomeDialog />

      <DebugTools />

      <MediaQuery />
    </Providers>
  );
};
