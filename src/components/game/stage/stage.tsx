import { cn } from "@/lib/cn";

export const GameStage = (props: React.ComponentProps<"section">) => {
  const { className, children } = props;

  return (
    <section
      className={cn(
        "relative",
        "w-full",
        "p-2",
        "bg-secondary/95",
        "border-primary border-b",
        className
      )}
      data-slot="game-stage"
    >
      {children}
    </section>
  );
};
