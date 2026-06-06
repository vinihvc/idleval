import { Image } from "@unpic/react";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

export interface UpgradeCardProps extends React.ComponentProps<"article"> {
  affordable?: boolean;
  complete?: boolean;
  description?: string;
  image: string;
  title?: string;
}

export const UpgradeCard = (props: UpgradeCardProps) => {
  const {
    image,
    title,
    description,
    affordable,
    complete,
    className,
    children,
    ...rest
  } = props;

  return (
    <article
      className={cn(
        "group relative",
        "bg-muted",
        "transition-all",
        "inset-shadow-xs overflow-hidden rounded-md border-3",
        "data-[affordable=true]:border-success/80",
        "data-[complete=true]:border-success data-[complete=true]:bg-success",
        "focus-visible:outline-0 focus-visible:ring-[3px] focus-visible:ring-primary/50",
        className
      )}
      data-affordable={affordable}
      data-complete={complete}
      {...rest}
    >
      <div className="relative aspect-square w-full overflow-hidden border-inherit border-b-2">
        <Image
          alt=""
          aria-hidden
          className="pixel-crisp pointer-events-none size-full object-cover"
          height={112}
          layout="constrained"
          src={image}
          width={112}
        />
        {title && (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="absolute inset-x-0 bottom-0 bg-background/85 px-2 py-1 text-center font-medium text-foreground text-sm leading-tight">
                {title}
              </p>
            </TooltipTrigger>
            {description && (
              <TooltipContent className="max-w-xs">
                {description}
              </TooltipContent>
            )}
          </Tooltip>
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
        "inset-shadow-none rounded-none border-0",
        className
      )}
      clickEffect={false}
      size="sm"
      {...rest}
    />
  );
};

interface UpgradeCardBadgeProps extends React.ComponentProps<"div"> {
  /**
   * The icon to display in the badge
   */
  icon: React.ReactNode;
  /**
   * The position of the badge
   */
  position?: "left" | "right";
}

export const UpgradeCardBadge = (props: UpgradeCardBadgeProps) => {
  const { position = "right", icon, className, children } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "absolute top-1",
            position === "left" ? "left-1" : "right-1"
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
