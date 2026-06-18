import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { FallingLeaves } from "@/components/effects/falling-leaves";
import { FactoryGrid } from "@/components/game/factory-grid";
import { Missions } from "@/components/game/missions/missions";
import { GamePanel } from "@/components/game/panel";
import { GameShell } from "@/components/game/shell";
import { GameStage } from "@/components/game/stage/stage";
import { Background } from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { GameSectionDialogs } from "@/components/layout/game-section-dialogs";
import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkipNavContent, SkipNavLink } from "@/components/ui/skip-nav";
import { m } from "@/i18n/messages";
import { Providers } from "./providers";
import { useDisableContextMenu } from "./use-context-menu";

const LazyDevTools = import.meta.env.DEV
  ? React.lazy(() =>
      import("@/components/debug/dev-tools").then((module) => ({
        default: module.DevTools,
      }))
    )
  : null;

const LazyWelcomeDialog = React.lazy(() =>
  import("@/components/dialog/welcome/welcome").then((module) => ({
    default: module.WelcomeDialog,
  }))
);

export const HomePage = () => {
  useDisableContextMenu();

  return (
    <Providers>
      <SkipNavLink>{m["ui.a11y.skipToContent"]()}</SkipNavLink>

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden sm:h-auto sm:flex-none sm:overflow-visible">
        <Background />
        <FallingLeaves />

        <GameShell>
          <GamePanel>
            <Header />

            <GameStage>
              <Missions className="max-w-md" />
            </GameStage>

            <main className="min-h-0 flex-1">
              <SkipNavContent />

              <ScrollArea className="**:data-[slot=scroll-area-scrollbar]:hidden">
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

      <GameSectionDialogs />

      <Analytics />

      {LazyDevTools && (
        <React.Suspense fallback={null}>
          <LazyDevTools />
        </React.Suspense>
      )}
    </Providers>
  );
};
