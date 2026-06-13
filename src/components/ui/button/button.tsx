import { ark } from "@ark-ui/react/factory";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Spinner } from "@/components/ui/spinner";
import { borderedText } from "@/components/ui/text-border";
import { cn } from "@/lib/cn";
import { type SoundsType, sound as soundFunction } from "@/providers/sound";

export const buttonVariants = tv({
  base: [
    "relative",
    "inline-flex items-center justify-center gap-2",
    "font-medium text-base tracking-wide",
    "inset-shadow-xs rounded-lg border-3",
    "whitespace-nowrap",
    "transition-all",
    "outline-none focus-visible:ring-[3px]",
    "disabled:pointer-events-none aria-disabled:pointer-events-none aria-disabled:opacity-64",
    "data-disabled:pointer-events-none data-disabled:opacity-64",
    "data-[state=loading]:pointer-events-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "motion-reduce:transition-none!",
  ],
  variants: {
    variant: {
      default: [
        "bg-primary",
        "border-primary-foreground/30 shadow-primary/24",
        "text-primary-foreground",
        "active:brightness-95",
        "hover:brightness-105",
        "focus-visible:border-background",
      ],
      brown: [
        "bg-secondary",
        "text-foreground",
        "border-primary/40",
        "active:brightness-95",
        "hover:brightness-105",
        "focus-visible:ring-primary/50",
      ],
      cream: [
        "bg-popover",
        "text-muted",
        "border-primary/60",
        "active:brightness-95",
        "hover:brightness-105",
        "focus-visible:ring-primary/50",
      ],
      stone: [
        "bg-stone",
        "text-white",
        "active:brightness-95",
        "border-stone-foreground/40",
        "hover:brightness-105 focus-visible:ring-stone/50",
      ],
      green: [
        "bg-success",
        "text-white",
        "active:brightness-95",
        "border-success-foreground/40",
        "hover:brightness-105 focus-visible:ring-success/50",
      ],
      blue: [
        "bg-info",
        "text-white",
        "active:brightness-95",
        "border-info-foreground/40",
        "hover:brightness-105 focus-visible:ring-info/50",
      ],
      purple: [
        "bg-purple",
        "text-white",
        "active:brightness-95",
        "border-purple-foreground/40",
        "hover:brightness-105 focus-visible:ring-purple/50",
      ],
      teal: [
        "bg-teal",
        "text-white",
        "active:brightness-95",
        "border-teal-foreground/40",
        "hover:brightness-105 focus-visible:ring-teal/50",
      ],
      olive: [
        "bg-olive",
        "text-white",
        "active:brightness-95",
        "border-olive-foreground/40",
        "hover:brightness-105 focus-visible:ring-olive/50",
      ],
      wine: [
        "bg-wine",
        "text-white",
        "active:brightness-95",
        "border-wine-foreground/40",
        "hover:brightness-105 focus-visible:ring-wine/50",
      ],
      ember: [
        "bg-ember",
        "text-ember-foreground",
        "active:brightness-95",
        "border-ember-foreground/40",
        "hover:brightness-105 focus-visible:ring-ember/50",
      ],
      destructive: [
        "bg-destructive",
        "text-white",
        "active:brightness-95",
        "border-destructive-foreground/40",
        "hover:brightness-105 focus-visible:ring-destructive/50",
      ],
      ghost: [
        "text-foreground",
        "active:brightness-95",
        "hover:brightness-105",
        "hover:bg-muted/50",
        "border-transparent",
        "focus-visible:border-primary",
      ],
    },
    size: {
      xs: "h-7 px-2 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
      md: "h-9 px-4 py-2 has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-4",
      lg: "h-10 px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-5",
      xl: "h-11 px-6 has-[>svg]:px-6 [&_svg:not([class*='size-'])]:size-5",
      "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
      "icon-md": "size-9 [&_svg:not([class*='size-'])]:size-4",
      "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-5",
      "icon-xl": 'size-11 [&_svg:not([class*="size-"])]:size-5',
    },
    clickEffect: {
      true: "active:scale-[0.99]",
    },
  },
  defaultVariants: {
    variant: "brown",
    size: "md",
    clickEffect: true,
  },
});

export interface ButtonProps
  extends React.ComponentProps<typeof ark.button>,
    VariantProps<typeof buttonVariants> {
  /**
   * If `true`, the button will be rendered as a child element.
   *
   * @default false
   */
  asChild?: boolean;
  /**
   * Show a loading indicator
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * Sound played on click. Pass `false` to disable.
   *
   * @default 'click'
   */
  sound?: SoundsType | false;
}

export const Button = (props: ButtonProps) => {
  const {
    type = "button",
    variant = "default",
    size,
    sound = "click",
    asChild = false,
    isLoading = false,
    clickEffect,
    className,
    onClick,
    children,
    ...rest
  } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (sound !== false) {
      soundFunction.play(sound);
    }

    onClick?.(event);
  };

  const borderedVariant = BUTTON_TEXT_BORDER[variant];

  return (
    <ark.button
      asChild={asChild}
      className={cn(
        buttonVariants({ variant, size, clickEffect }),
        borderedVariant &&
          borderedText({ variant: borderedVariant, size: "lg" }),
        className
      )}
      data-size={size}
      data-slot="button"
      data-state={isLoading ? "loading" : "idle"}
      data-variant={variant}
      type={type}
      {...rest}
      aria-busy={isLoading}
      aria-disabled={isLoading || rest["aria-disabled"]}
      onClick={handleClick}
    >
      {isLoading ? (
        <>
          <span aria-hidden className="invisible">
            {children}
          </span>
          <span className="sr-only">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner aria-hidden />
          </span>
        </>
      ) : (
        children
      )}
    </ark.button>
  );
};

export const BUTTON_TEXT_BORDER = {
  default: "default",
  brown: "brown",
  cream: "cream",
  stone: "stone",
  green: "green",
  blue: "blue",
  purple: "purple",
  teal: "teal",
  olive: "olive",
  wine: "wine",
  ember: "ember",
  destructive: "red",
  ghost: "cream",
} as const;
