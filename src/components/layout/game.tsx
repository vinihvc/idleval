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
        "max-sm:flex-1 max-sm:rounded-none max-sm:border-x-0 max-sm:py-16",
        "sm:rounded-xl",
        className
      )}
      variant="stone"
      {...rest}
    />
  );
};
