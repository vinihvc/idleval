import { cn } from "@/lib/cn";
import { IS_DEV } from "@/lib/envs";

export const GamePanel = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        { "select-none": !IS_DEV },
        "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-none border-x-0",
        "sm:h-auto sm:flex-none",
        "bg-secondary/32 sm:bg-secondary/80",
        "border-primary sm:inset-shadow-xs sm:rounded-xl sm:border-2",
        className
      )}
      data-slot="game-panel"
      {...rest}
    />
  );
};
