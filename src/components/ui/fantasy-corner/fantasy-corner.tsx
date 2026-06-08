import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const fantasyCornerVariants = tv({
  base: [
    "[--space:--spacing(2.5)]",
    "absolute",
    "size-5 sm:size-6",
    "text-primary",
    "pointer-events-none",
    "drop-shadow-sm",
  ],
  variants: {
    position: {
      tl: "-top-(--space) -left-(--space)",
      tr: "-top-(--space) -right-(--space) rotate-90",
      bl: "-bottom-(--space) -left-(--space) -rotate-90",
      br: "-right-(--space) -bottom-(--space) rotate-180",
    },
  },
});

interface FantasyCornerProps
  extends React.ComponentProps<"svg">,
    VariantProps<typeof fantasyCornerVariants> {}

export const FantasyCorner = (props: FantasyCornerProps) => {
  const { position, className, ...rest } = props;

  return (
    <svg
      aria-hidden
      className={cn(fantasyCornerVariants({ position }), className)}
      role="presentation"
      viewBox="0 0 24 24"
      {...rest}
    >
      <path
        d="M3 21V8.5C3 5.46 5.46 3 8.5 3H21"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M7 21V10C7 8.34 8.34 7 10 7H21"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M7 14C10 14 12 12 12 9"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="round"
        strokeWidth="3.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M3 21V8.5C3 5.46 5.46 3 8.5 3H21"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M7 21V10C7 8.34 8.34 7 10 7H21"
        fill="none"
        opacity="0.55"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M7 14C10 14 12 12 12 9"
        fill="none"
        opacity="0.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M11 3 13 5 11 7 9 5Z"
        fill="currentColor"
        opacity="0.9"
        stroke="var(--secondary)"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
      <path
        d="M3 11 5 9 7 11 5 13Z"
        fill="currentColor"
        opacity="0.9"
        stroke="var(--secondary)"
        strokeLinejoin="round"
        strokeWidth="1.25"
      />
      <circle
        cx="5"
        cy="5"
        fill="currentColor"
        r="2.25"
        stroke="var(--secondary)"
        strokeWidth="1.25"
      />
      <circle
        cx="15.5"
        cy="7"
        fill="currentColor"
        opacity="0.65"
        r="1"
        stroke="var(--secondary)"
        strokeWidth="0.75"
      />
      <circle
        cx="7"
        cy="15.5"
        fill="currentColor"
        opacity="0.65"
        r="1"
        stroke="var(--secondary)"
        strokeWidth="0.75"
      />
    </svg>
  );
};
