import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const fantasyStitchVariants = tv({
  base: [
    "pointer-events-none absolute",
    "text-primary",
    "opacity-85",
    "drop-shadow-sm",
  ],
  variants: {
    side: {
      top: "top-2 right-7 left-7 h-3",
      right: "top-7 right-2 bottom-7 w-3",
      bottom: "right-7 bottom-2 left-7 h-3 rotate-180",
      left: "top-7 bottom-7 left-2 w-3 rotate-180",
    },
  },
  defaultVariants: {
    side: "top",
  },
});

interface FantasyStitchProps
  extends React.ComponentProps<"svg">,
    VariantProps<typeof fantasyStitchVariants> {}

export const FantasyStitch = (props: FantasyStitchProps) => {
  const { side, className, ...rest } = props;

  const isVertical = side === "left" || side === "right";

  return (
    <svg
      aria-hidden
      className={cn(fantasyStitchVariants({ side }), className)}
      preserveAspectRatio="none"
      role="presentation"
      viewBox={isVertical ? "0 0 12 100" : "0 0 100 12"}
      {...rest}
    >
      <path
        d={isVertical ? "M6 2V98" : "M2 6H98"}
        fill="none"
        opacity="0.75"
        stroke="var(--secondary)"
        strokeLinecap="round"
        strokeWidth="5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={isVertical ? "M6 2V98" : "M2 6H98"}
        fill="none"
        opacity="0.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={
          isVertical
            ? "M3 8 9 14 M3 20 9 26 M3 32 9 38 M3 44 9 50 M3 56 9 62 M3 68 9 74 M3 80 9 86 M3 92 9 98"
            : "M8 3 14 9 M20 3 26 9 M32 3 38 9 M44 3 50 9 M56 3 62 9 M68 3 74 9 M80 3 86 9 M92 3 98 9"
        }
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
