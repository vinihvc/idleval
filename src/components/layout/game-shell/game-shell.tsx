import { cn } from "@/lib/cn";

export const GameShell = (props: React.ComponentProps<"div">) => {
  const { className, children, ...rest } = props;

  return (
    <div
      className={cn(
        "flex w-full flex-col",
        "min-h-0 w-full flex-1",
        "sm:h-auto sm:flex-none sm:items-center sm:justify-center",
        "mx-auto max-w-4xl",
        className
      )}
      data-slot="game-shell"
      {...rest}
    >
      {children}
    </div>
  );
};
