import { cn } from "@/lib/cn";
import { FantasyCorner } from "./fantasy-corner";

interface FantasyPanelProps extends React.ComponentProps<"div"> {
  showCorners?: boolean;
  variant?: "stone" | "parchment" | "transparent";
}

export const FantasyPanel = (props: FantasyPanelProps) => {
  const {
    showCorners = true,
    variant = "stone",
    className,
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        "relative",
        variant === "stone" && [
          "inset-shadow-xs border-2 border-primary/60 bg-secondary/32 sm:bg-secondary/80",
        ],
        variant === "parchment" && [
          "inset-shadow-xs border-2 border-primary/40 bg-popover text-popover-foreground",
        ],
        variant === "transparent" && "border border-primary/30",
        "rounded-lg",
        className
      )}
      data-slot="fantasy-panel"
      {...rest}
    >
      {showCorners ? (
        <>
          <FantasyCorner position="tl" />
          <FantasyCorner position="tr" />
          <FantasyCorner position="bl" />
          <FantasyCorner position="br" />
        </>
      ) : null}
      {children}
    </div>
  );
};
