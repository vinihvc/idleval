import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";
import { FantasyCorner } from "./fantasy-corner";

const fantasyPanelVariants = tv({
  base: ["relative", "rounded-lg"],
  variants: {
    variant: {
      stone: [
        "inset-shadow-xs border-2 border-primary/60 bg-secondary/32 sm:bg-secondary/80",
      ],
      parchment: [
        "inset-shadow-xs border-2 border-primary/40 bg-popover text-muted",
      ],
      transparent: "border border-primary/30",
    },
  },
  defaultVariants: {
    variant: "stone",
  },
});

interface FantasyPanelProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fantasyPanelVariants> {
  showCorners?: boolean;
}

export const FantasyPanel = (props: FantasyPanelProps) => {
  const { showCorners = true, variant, className, children, ...rest } = props;

  return (
    <div
      className={cn(fantasyPanelVariants({ variant }), className)}
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
