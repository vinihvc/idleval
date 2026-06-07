import { DebugTools } from "@/components/debug/debug-tools";
import { MediaQuery } from "@/components/debug/media-query";
import { WelcomeDialog } from "@/components/dialog/welcome";
import { Background } from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Game } from "@/components/layout/game";
import { Header } from "@/components/layout/header/header";
import { BottomNavigation } from "@/components/layout/navigation";
import { FactoryCard } from "@/components/ui/factory-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FACTORY_TYPES } from "@/content/factories";
import { useDisableContextMenu } from "@/hooks/use-context-menu";
import { cn } from "@/lib/cn";
import { IS_DEV } from "@/lib/envs";
import { Providers } from "./providers";

export const HomePage = () => {
  useDisableContextMenu();

  return (
    <Providers>
      <Background />

      <div className="flex min-h-0 w-full flex-1 flex-col sm:items-center sm:justify-center">
        <Game className={cn({ "select-none": !IS_DEV })}>
          <Header />

          <ScrollArea className="flex-1">
            <div className="grid w-full gap-6 px-2 py-4 md:grid-cols-2 md:gap-8 md:px-4 md:py-6">
              {FACTORY_TYPES.map((factory) => (
                <FactoryCard key={factory} type={factory} />
              ))}
            </div>
          </ScrollArea>
        </Game>

        <BottomNavigation />
      </div>

      <Footer />

      <WelcomeDialog />

      <DebugTools />

      <MediaQuery />
    </Providers>
  );
};
