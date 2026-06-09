import { cn } from "@/lib/cn";

export const GameShell = (props: React.ComponentProps<"div">) => {
  const { className, children, ...rest } = props;

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col",
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
