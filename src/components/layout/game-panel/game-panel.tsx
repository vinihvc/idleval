import { cn } from "@/lib/cn";

export const GamePanel = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col",
        "max-sm:min-h-0 max-sm:w-full max-sm:flex-1 max-sm:overflow-hidden",
        "max-sm:rounded-none max-sm:border-x-0",
        "sm:h-auto sm:overflow-visible",
        "bg-secondary/32 sm:bg-secondary/80",
        "border-primary/60 sm:inset-shadow-xs sm:rounded-xl sm:border-2",
        className
      )}
      data-slot="game-panel"
      {...rest}
    />
  );
};
