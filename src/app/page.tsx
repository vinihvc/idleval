import React from "react";
import { ActionTools } from "@/components/debug/action-tools";
import { MediaQuery } from "@/components/debug/media-query";
import { FactoryGrid } from "@/components/game/factory-grid";
import { GamePanel } from "@/components/game/panel";
import { GameShell } from "@/components/game/shell";
import { GameStage } from "@/components/game/stage/stage";
import { Background } from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDisableContextMenu } from "@/hooks/use-context-menu";
import { m } from "@/i18n/messages";
import { Providers } from "./providers";

const LazyWelcomeDialog = React.lazy(
  () => import("@/components/dialog/welcome/welcome")
);

export const HomePage = () => {
  useDisableContextMenu();

  return (
    <Providers>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-200 focus:rounded-md focus:border-2 focus:border-primary focus:bg-background focus:px-4 focus:py-2 focus:font-medium focus:text-foreground focus:shadow-md"
        href="#main-content"
      >
        {m["ui.a11y.skipToContent"]()}
      </a>

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden sm:h-auto sm:flex-none sm:overflow-visible">
        <Background />

        <GameShell>
          <GamePanel>
            <Header />

            <GameStage />

            <main className="min-h-0 flex-1" id="main-content">
              <ScrollArea>
                <FactoryGrid />
              </ScrollArea>
            </main>
          </GamePanel>

          <Navigation />
        </GameShell>

        <Footer />
      </div>

      <React.Suspense fallback={null}>
        <LazyWelcomeDialog />
      </React.Suspense>

      <ActionTools />

      <MediaQuery />
    </Providers>
  );
};
