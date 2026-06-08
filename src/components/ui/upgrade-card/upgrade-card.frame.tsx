import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const upgradeCardCornerVariants = tv({
  base: [
    "pointer-events-none absolute size-9 text-primary",
    "[--corner-offset:--spacing(-0.5)]",
    "drop-shadow-[0_1px_1px_oklch(0.12_0.02_55/0.35)]",
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
      viewBox="0 0 32 32"
      {...rest}
    >
      {/* Outer bracket — shadow */}
      <path
        d="M1 23V9.5L9.5 1H23"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="5"
        vectorEffect="non-scaling-stroke"
      />
      {/* Inner bracket — shadow */}
      <path
        d="M1 16V6L6 1H16"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="3.25"
        vectorEffect="non-scaling-stroke"
      />
      {/* Outer bracket — gold */}
      <path
        d="M1 23V9.5L9.5 1H23"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      {/* Inner bracket — gold accent */}
      <path
        d="M1 16V6L6 1H16"
        fill="none"
        opacity="0.55"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      {/* Horizontal flourish */}
      <path
        d="M23 1H27.5C29.8 1 31 2.6 31 5"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="round"
        strokeWidth="2.75"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M23 1H27.5C29.8 1 31 2.6 31 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
        vectorEffect="non-scaling-stroke"
      />
      {/* Vertical flourish */}
      <path
        d="M1 23V27.5C1 29.8 2.6 31 5 31"
        fill="none"
        stroke="var(--secondary)"
        strokeLinecap="round"
        strokeWidth="2.75"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 23V27.5C1 29.8 2.6 31 5 31"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
        vectorEffect="non-scaling-stroke"
      />
      {/* Corner gem */}
      <path
        d="M3.5 3.5L7 1L10.5 3.5L7 6Z"
        fill="currentColor"
        opacity="0.95"
        stroke="var(--secondary)"
        strokeLinejoin="round"
        strokeWidth="0.85"
      />
      {/* Rivets along arms */}
      <circle
        cx="14"
        cy="1.25"
        fill="currentColor"
        r="1.1"
        stroke="var(--secondary)"
        strokeWidth="0.65"
      />
      <circle
        cx="1.25"
        cy="14"
        fill="currentColor"
        r="1.1"
        stroke="var(--secondary)"
        strokeWidth="0.65"
      />
      <circle
        cx="18.5"
        cy="1.25"
        fill="currentColor"
        opacity="0.7"
        r="0.7"
        stroke="var(--secondary)"
        strokeWidth="0.5"
      />
      <circle
        cx="1.25"
        cy="18.5"
        fill="currentColor"
        opacity="0.7"
        r="0.7"
        stroke="var(--secondary)"
        strokeWidth="0.5"
      />
      {/* Inner vine accent */}
      <path
        d="M8 8C10.5 6.5 12 4.5 12.5 2"
        fill="none"
        opacity="0.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M8 8C6.5 10.5 4.5 12 2 12.5"
        fill="none"
        opacity="0.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
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
        "pointer-events-none absolute top-0 left-1/2 z-20 h-3.5 w-8 -translate-x-1/2 text-primary",
        className
      )}
      role="presentation"
      viewBox="0 0 32 14"
      {...rest}
    >
      <path
        d="M0 1H11L16 6L21 1H32"
        fill="none"
        stroke="var(--secondary)"
        strokeLinejoin="miter"
        strokeWidth="4"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 1H11L16 6L21 1H32"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="miter"
        strokeWidth="1.75"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M13.5 2.5L16 6L18.5 2.5"
        fill="currentColor"
        opacity="0.9"
        stroke="var(--secondary)"
        strokeLinejoin="round"
        strokeWidth="0.85"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx="16"
        cy="8.5"
        fill="currentColor"
        r="1.75"
        stroke="var(--secondary)"
        strokeWidth="0.75"
      />
      <path
        d="M6 1C4 3 3.5 5 4 7"
        fill="none"
        opacity="0.65"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M26 1C28 3 28.5 5 28 7"
        fill="none"
        opacity="0.65"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1"
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
