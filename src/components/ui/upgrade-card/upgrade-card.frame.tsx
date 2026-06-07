import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const upgradeCardCornerVariants = tv({
  base: [
    "pointer-events-none absolute size-7 text-primary",
    "[--corner-offset:--spacing(0.5)]",
  ],
  variants: {
    position: {
      tl: "-top-(--corner-offset) -left-(--corner-offset)",
      tr: "-top-(--corner-offset) -right-(--corner-offset) rotate-90",
      bl: "-bottom-(--corner-offset) -left-(--corner-offset) -rotate-90",
      br: "-right-(--corner-offset) -bottom-(--corner-offset) rotate-180",
    },
  },
});

interface UpgradeCardCornerProps
  extends React.ComponentProps<"svg">,
    VariantProps<typeof upgradeCardCornerVariants> {}

const UpgradeCardCorner = (props: UpgradeCardCornerProps) => {
  const { position, className, ...rest } = props;

  return (
    <svg
      aria-hidden
      className={cn(upgradeCardCornerVariants({ position }), className)}
      role="presentation"
      viewBox="0 0 28 28"
      {...rest}
    >
      <path
        d="M1 10V4H4V1H10"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="4.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 14V8H8V1H14"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 10V4H4V1H10"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="1.75"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 14V8H8V1H14"
        fill="none"
        opacity="0.55"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <rect
        fill="currentColor"
        height="2.5"
        opacity="0.9"
        stroke="var(--secondary)"
        strokeWidth="0.75"
        width="2.5"
        x="0.5"
        y="0.5"
      />
    </svg>
  );
};

const UpgradeCardTopOrnament = (props: React.ComponentProps<"svg">) => {
  const { className, ...rest } = props;

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-0 left-1/2 h-2.5 w-5 -translate-x-1/2 text-primary",
        className
      )}
      role="presentation"
      viewBox="0 0 20 10"
      {...rest}
    >
      <path
        d="M0 0.5H7.5L10 3.5L12.5 0.5H20"
        fill="none"
        stroke="var(--secondary)"
        strokeLinejoin="miter"
        strokeWidth="3.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 0.5H7.5L10 3.5L12.5 0.5H20"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="miter"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M8.5 1.5L10 3.5L11.5 1.5"
        fill="currentColor"
        opacity="0.85"
        stroke="var(--secondary)"
        strokeLinejoin="round"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export const UpgradeCardFrame = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-10 text-primary",
        "group-data-[affordable=true]:text-success/90",
        "group-data-[complete=true]:text-success",
        className
      )}
      {...rest}
    >
      <UpgradeCardCorner position="tl" />
      <UpgradeCardCorner position="tr" />
      <UpgradeCardCorner position="bl" />
      <UpgradeCardCorner position="br" />
      <UpgradeCardTopOrnament />
    </div>
  );
};
