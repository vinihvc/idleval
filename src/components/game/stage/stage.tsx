import { GameStagePowerUp } from "@/components/ui/power-up/power-up";
import { cn } from "@/lib/cn";

interface GameStageProps {
  className?: string;
}

export const GameStage = (props: GameStageProps) => {
  const { className } = props;

  return (
    <section
      className={cn(
        "h-9",
        "flex shrink-0 items-center justify-end gap-2",
        "px-2 sm:gap-3 sm:px-3",
        "bg-secondary/95",
        "border-primary border-b",
        className
      )}
      data-slot="game-stage"
    >
      <GameStagePowerUp />
    </section>
  );
};
