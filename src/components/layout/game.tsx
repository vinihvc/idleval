import { cn } from "@/lib/cn";

interface GameProps extends React.ComponentProps<"div"> {}

export const Game = (props: GameProps) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        "container relative max-w-4xl overflow-hidden",
        "flex flex-col",
        "border border-foreground/50",
        "max-sm:flex-1 max-sm:py-16",
        "sm:rounded-xl sm:bg-foreground/20",
        className
      )}
      {...rest}
    />
  );
};
