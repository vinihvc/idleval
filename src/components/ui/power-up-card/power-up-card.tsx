import { Image } from "@unpic/react";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { boxBorder } from "@/components/ui/box-border";
import { POWER_UP_DATA, type PowerUpId } from "@/content/power-ups";
import { cn } from "@/lib/cn";

const powerUpCardVariants = tv({
  base: [
    "relative",
    "flex w-full flex-col gap-1",
    "inset-shadow-xs rounded-md border-3",
    "transition-opacity",
    boxBorder({ variant: "default", size: "sm" }),
  ],
  variants: {
    variant: {
      default: [
        "bg-secondary/80",
        "border-primary/90",
        boxBorder({ variant: "default", size: "sm" }),
      ],
      green: [
        "bg-success/20 before:absolute before:inset-0 before:z-[-1] before:bg-secondary/64",
        "border-success/90",
        boxBorder({ variant: "green", size: "sm" }),
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PowerUpCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof powerUpCardVariants> {}

export const PowerUpCard = (props: PowerUpCardProps) => {
  const { variant = "default", className, ...rest } = props;

  return (
    <div
      className={cn(powerUpCardVariants({ variant }), className)}
      data-slot="power-up-card"
      {...rest}
    />
  );
};

export interface PowerUpCardMediaProps extends React.ComponentProps<"div"> {
  /**
   * The power up ID to display.
   */
  powerUpId?: PowerUpId;
}

export const PowerUpCardMedia = (props: PowerUpCardMediaProps) => {
  const { className, powerUpId, ...rest } = props;

  if (!powerUpId) {
    return (
      <div
        aria-hidden
        className={cn(
          "size-full",
          "rounded-sm border-2 border-primary/25",
          "bg-background/20",
          className
        )}
        {...rest}
      />
    );
  }

  return (
    <div
      className={cn(
        "min-h-0",
        "flex flex-1 items-center justify-center",
        className
      )}
      {...rest}
    >
      <Image
        alt=""
        aria-hidden
        className="pixel-crisp size-12 object-contain"
        height={80}
        src={POWER_UP_DATA[powerUpId].image}
        width={80}
      />
    </div>
  );
};

export const PowerUpCardFooter = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn("relative", "w-full min-w-0", className)}
      data-slot="power-up-card-footer"
      {...rest}
    />
  );
};
