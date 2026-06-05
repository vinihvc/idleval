import { FantasyPanel } from "@/components/ui/fantasy/fantasy-panel";
import { cn } from "@/lib/cn";

export const Game = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <FantasyPanel
      className={cn(
        "container max-w-4xl",
        "relative overflow-hidden",
        "flex flex-col",
        "pt-16 max-sm:flex-1 max-sm:rounded-none max-sm:border-x-0 sm:py-0",
        "sm:rounded-xl",
        className
      )}
      variant="stone"
      {...rest}
    />
  );
};
