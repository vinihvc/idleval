import { Image } from "@unpic/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpgradeCardFrame } from "@/components/ui/upgrade-card/upgrade-card.frame";
import { cn } from "@/lib/cn";

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
        "group relative",
        "bg-primary",
        "transition-all",
        "inset-shadow-xs rounded-lg p-1.5",
        "focus-visible:outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
        className
      )}
      data-affordable={affordable}
      data-complete={complete}
      {...rest}
    >
      <UpgradeCardFrame />

      <div className="relative aspect-square w-full overflow-hidden border-primary/30 bg-secondary group-data-[affordable=true]:border-success/50 group-data-[complete=true]:border-success/70">
        <Image
          alt=""
          aria-hidden
          className="pixel-crisp pointer-events-none size-full rounded-t-md object-cover"
          height={112}
          layout="constrained"
          src={image}
          width={112}
        />
        {title && (
          <p className="absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1 text-center font-medium text-foreground text-sm leading-tight">
            {title}
          </p>
        )}
      </div>

      {children}
    </article>
  );
};

export const UpgradeCardTrigger = (
  props: React.ComponentProps<typeof Button>
) => {
  const { className, ...rest } = props;

  return (
    <Button
      className={cn(
        "w-full",
        "font-medium text-sm",
        "inset-shadow-none rounded-none rounded-b-md border",
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
            "absolute top-2 z-20",
            position === "left" ? "left-2" : "right-2"
          )}
        >
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-lg border-2 border-secondary bg-popover text-secondary-foreground",
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
