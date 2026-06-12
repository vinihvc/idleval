import { Image } from "@unpic/react";
import type React from "react";
import { boxBorder } from "@/components/ui/box-border";
import { POWER_UP_DATA, type PowerUpId } from "@/content/power-ups";
import { cn } from "@/lib/cn";

export interface PowerUpCardProps extends React.ComponentProps<"div"> {
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  powerUpId?: PowerUpId;
}

export const PowerUpCard = (props: PowerUpCardProps) => {
  const { badge, className, footer, powerUpId, ...rest } = props;

  return (
    <div
      className={cn(
        "relative",
        "aspect-square w-full",
        "p-1",
        "flex items-center justify-center",
        "bg-secondary/80",
        "inset-shadow-xs rounded-md border-3 border-primary/90",
        "transition-opacity",
        boxBorder({ variant: "default", size: "sm" }),
        className
      )}
      data-slot="power-up-card"
      {...rest}
    >
      {powerUpId ? (
        <div className="relative flex size-full flex-col gap-1">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Image
              alt=""
              aria-hidden
              className="size-[68%] rounded-sm object-contain"
              height={400}
              src={POWER_UP_DATA[powerUpId].image}
              width={400}
            />
          </div>
          {badge ? <div className="absolute top-1 right-1">{badge}</div> : null}
          {footer}
        </div>
      ) : (
        <div
          aria-hidden
          className={cn(
            "size-full rounded-sm border-2 border-primary/25 border-dashed",
            "bg-background/20"
          )}
        />
      )}
    </div>
  );
};
