import { Image } from "@unpic/react";
import type React from "react";
import { tv } from "tailwind-variants";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpgradeCardFrame } from "@/components/ui/upgrade-card/upgrade-card.frame";
import { cn } from "@/lib/cn";

export const upgradeCardFooterVariants = tv({
  base: [
    "w-full shrink-0",
    "justify-between gap-2 px-2.5 py-2",
    "rounded-none rounded-b-sm",
    "border-0 border-primary-foreground/20 border-t-2",
    "font-medium text-sm",
    "inset-shadow-xs",
    "**:data-[slot=badge]:rounded-full",
    "**:data-[slot=badge]:border-primary-foreground/30",
    "**:data-[slot=badge]:bg-primary",
    "**:data-[slot=badge]:px-2",
    "**:data-[slot=badge]:text-primary-foreground",
    "**:data-[slot=badge]:shadow-[0_1px_0_oklch(1_0_0/0.15)]",
  ],
  variants: {
    variant: {
      brown: ["bg-popover/95 text-popover-foreground"],
      green: [],
    },
  },
  defaultVariants: {
    variant: "brown",
  },
});

export interface UpgradeCardProps extends React.ComponentProps<"article"> {
  affordable?: boolean;
  complete?: boolean;
  description?: string;
  image: string;
  title?: string;
}

export const UpgradeCard = (props: UpgradeCardProps) => {
  const { image, title, affordable, complete, className, children, ...rest } =
    props;

  return (
    <article
      className={cn(
        "group relative flex aspect-3/4 w-full flex-col",
        "rounded-md border-3 border-primary/90 bg-primary p-1",
        "shadow-[0_3px_0_oklch(0.65_0.12_75),0_6px_16px_oklch(0.12_0.02_55/0.45)]",
        "inset-shadow-xs transition-shadow duration-200",
        "group-data-[affordable=true]:border-success/70",
        "group-data-[affordable=true]:shadow-[0_3px_0_oklch(0.45_0.12_155),0_6px_16px_oklch(0.25_0.08_155/0.35)]",
        "group-data-[complete=true]:border-success group-data-[complete=true]:opacity-90",
        "focus-visible:outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
        className
      )}
      data-affordable={affordable}
      data-complete={complete}
      {...rest}
    >
      <UpgradeCardFrame />

      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm",
          "border-2 border-primary-foreground/25 bg-background",
          "shadow-[inset_0_1px_0_oklch(1_0_0/0.08)]"
        )}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden bg-secondary">
          <Image
            alt=""
            aria-hidden
            className="pixel-crisp pointer-events-none size-full object-cover object-center"
            height={140}
            layout="constrained"
            src={image}
            width={112}
          />
        </div>

        {title && (
          <div
            className={cn(
              "relative shrink-0 border-primary-foreground/20 border-t-2",
              "bg-background px-1.5 py-1",
              "shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
              "before:pointer-events-none before:absolute before:top-0 before:left-2 before:h-0 before:w-0",
              "before:border-x-4 before:border-x-transparent before:border-t-4 before:border-t-primary/40",
              "after:pointer-events-none after:absolute after:top-0 after:right-2 after:h-0 after:w-0",
              "after:border-x-4 after:border-x-transparent after:border-t-4 after:border-t-primary/40"
            )}
          >
            <p className="text-center font-bold text-foreground text-xs leading-tight tracking-wide">
              {title}
            </p>
          </div>
        )}
      </div>

      {children}
    </article>
  );
};

export const UpgradeCardTrigger = (
  props: React.ComponentProps<typeof Button>
) => {
  const { className, variant = "brown", ...rest } = props;

  return (
    <Button
      className={cn(
        upgradeCardFooterVariants({
          variant: variant === "green" ? "green" : "brown",
        }),
        variant === "green"
          ? "border-success-foreground/30 bg-success text-white"
          : undefined,
        className
      )}
      clickEffect={false}
      {...rest}
    />
  );
};

interface UpgradeCardBadgeProps extends React.ComponentProps<"div"> {
  icon: React.ReactNode;
  position?: "left" | "right";
}

export const UpgradeCardBadge = (props: UpgradeCardBadgeProps) => {
  const { position = "right", icon, className, children } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "absolute top-3 z-20",
            position === "left" ? "left-3" : "right-3"
          )}
        >
          <div
            className={cn(
              "flex size-6 items-center justify-center rounded-md",
              "border-2 border-primary bg-popover text-secondary-foreground",
              "shadow-[0_2px_0_oklch(0.65_0.12_75/0.45)] ring-2 ring-primary/15",
              className
            )}
          >
            {icon}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
};
