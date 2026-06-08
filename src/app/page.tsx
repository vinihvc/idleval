import React from "react";
import { DebugTools } from "@/components/debug/debug-tools";
import { MediaQuery } from "@/components/debug/media-query";
import { Background } from "@/components/layout/background";
import { FactoryGrid } from "@/components/layout/factory-grid";
import { Footer } from "@/components/layout/footer";
import { GamePanel } from "@/components/layout/game-panel";
import { GameShell } from "@/components/layout/game-shell";
import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDisableContextMenu } from "@/hooks/use-context-menu";
import { Providers } from "./providers";

const LazyWelcomeDialog = React.lazy(
  () => import("@/components/dialog/welcome/welcome")
);

export const HomePage = () => {
  useDisableContextMenu();

  return (
    <Providers>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden sm:h-auto sm:flex-none sm:overflow-visible">
        <Background />

        <GameShell>
          <GamePanel>
            <Header />

            <ScrollArea className="min-h-0 flex-1 sm:h-auto sm:flex-none sm:overflow-visible sm:**:data-[slot=scroll-area-viewport]:h-auto sm:**:data-[slot=scroll-area-viewport]:max-h-none">
              <FactoryGrid />
            </ScrollArea>
          </GamePanel>

          <Navigation />
        </GameShell>

        <Footer />
      </div>

      <React.Suspense fallback={null}>
        <LazyWelcomeDialog />
      </React.Suspense>

      <DebugTools />

      <MediaQuery />
    </Providers>
  );
};
