import React from "react";
import { Characters } from "@/components/characters";
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
import type { CharacterInstruction } from "@/components/pets/characters-pet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkipNavContent, SkipNavLink } from "@/components/ui/skip-nav";
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
      <SkipNavLink>{m["ui.a11y.skipToContent"]()}</SkipNavLink>

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden sm:h-auto sm:flex-none sm:overflow-visible">
        <Background />

        <GameShell>
          <GamePanel>
            <Header />

            <GameStage>
              <Characters
                imagePath={STAGE_CHARACTER_IMAGE_PATH}
                instructions={STAGE_CHARACTER_INSTRUCTIONS}
              />
            </GameStage>

            <main className="min-h-0 flex-1">
              <SkipNavContent />
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

const STAGE_CHARACTER_IMAGE_PATH = "/images/pets/characters-32";

const STAGE_CHARACTER_INSTRUCTIONS: CharacterInstruction[] = [
  { duration: 800, type: "wait" },
  { type: "moveTo", x: 32, y: 0, duration: 900 },
  { duration: 350, type: "wait" },
  { type: "moveTo", x: 96, y: 0, duration: 1500 },
  { duration: 600, type: "wait" },
  { type: "wave", duration: 700 },
  { duration: 300, type: "wait" },
  { type: "moveTo", x: 56, y: 0, duration: 750 },
  { type: "moveTo", x: 76, y: 0, duration: 420 },
  { type: "moveTo", x: 48, y: 0, duration: 520 },
  { duration: 900, type: "wait" },
  { type: "wave", duration: 500 },
  { type: "moveTo", x: 8, y: 0, duration: 1400 },
  { duration: 400, type: "wait" },
  { type: "moveTo", x: 24, y: 0, duration: 360 },
  { type: "moveTo", x: 0, y: 0, duration: 560 },
];
