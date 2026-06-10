import { GameStagePowerUp } from "@/components/ui/power-up/power-up";
import { cn } from "@/lib/cn";

export const GameStage = (props: React.ComponentProps<"section">) => {
  const { className, children } = props;

  return (
    <section
      className={cn(
        "relative",
        "w-full",
        "px-2 py-1",
        "bg-secondary/95",
        "border-primary border-b",
        className
      )}
      data-slot="game-stage"
    >
      <GameStagePowerUp className="absolute top-1/2 right-2 z-10 -translate-y-1/2" />

      {children}
    </section>
  );
};
