import { ark } from "@ark-ui/react/factory";
import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/cn";
import { useSettings } from "@/store";
import { type SoundsType, sound } from "./sound";
import { borderedText } from "./text-border";

export const buttonVariants = tv({
  base: [
    "relative",
    "inline-flex shrink-0 items-center justify-center gap-2",
    "font-medium text-sm tracking-wide",
    "rounded-lg border shadow-sm",
    "whitespace-nowrap",
    "transition-all",
    "active:scale-95",
    "outline-none focus-visible:ring-[3px]",
    "disabled:pointer-events-none aria-disabled:pointer-events-none",
    "data-disabled:pointer-events-none data-disabled:opacity-64",
    "data-[state=loading]:pointer-events-none",
    "[&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "motion-reduce:transition-none!",
  ],
  variants: {
    variant: {
      black: [
        "bg-foreground",
        "text-background",
        "border-background/20",
        "active:bg-neutral-950",
        "hover:bg-neutral-950",
        "focus-visible:ring-foreground/50",
      ],
      white: [
        "bg-background",
        "text-foreground",
        "border-foreground",
        "active:bg-neutral-100",
        "hover:bg-neutral-100",
        "focus-visible:ring-foreground/50",
      ],
      gray: [
        "bg-neutral-600",
        "text-white",
        "active:bg-neutral-800",
        "border-foreground",
        "hover:bg-neutral-800 focus-visible:ring-neutral-800/20",
      ],
      green: [
        "bg-green-600",
        "text-white",
        "active:bg-green-700",
        "border-green-800",
        "hover:bg-green-700 focus-visible:ring-green-800/20",
        "focus-visible:ring-green-800/50",
      ],
      blue: [
        "bg-blue-600",
        "text-white",
        "active:bg-blue-700",
        "border-blue-800",
        "hover:bg-blue-700 focus-visible:ring-blue-800/20",
      ],
      default: [
        "bg-primary",
        "border border-transparent shadow-primary/24",
        "text-primary-foreground",
        "hover:bg-primary/90",
        "focus-visible:border-background",
      ],
      outline: [
        "bg-transparent",
        "text-foreground",
        "border border-input shadow-sm/5",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:border-primary",
      ],
      destructive: [
        "bg-destructive",
        "text-white",
        "border border-transparent shadow-destructive/24",
        "hover:bg-destructive/90",
        "focus-visible:border-background focus-visible:ring-destructive-foreground/32",
      ],
      secondary: [
        "bg-secondary",
        "text-secondary-foreground",
        "border border-transparent",
        "focus-visible:border-primary",
        "hover:bg-secondary/80",
      ],
      ghost: [
        "hover:bg-accent hover:text-accent-foreground",
        "border border-transparent",
        "focus-visible:border-primary",
      ],
      link: [
        "border border-transparent",
        "text-primary underline-offset-4",
        "hover:underline",
        "focus-visible:border-primary",
      ],
    },
    size: {
      xs: "h-7 px-2",
      sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
      md: "h-9 px-4 py-2 has-[>svg]:px-3",
      lg: "h-10 px-6 has-[>svg]:px-4",
      xl: "h-11 px-6 has-[>svg]:px-6",
      icon: "size-9",
      "icon-xs": "size-6 rounded-sm",
      "icon-sm": "size-7",
      "icon-md": "size-8",
      "icon-lg": "size-9",
      "icon-xl": 'size-10 [&_svg:not([class*="size-"])]:size-5',
    },
  },
  defaultVariants: {
    variant: "black",
    size: "md",
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
   * If `true`, the button will play a sound when clicked.
   *
   * @default 'click'
   */
  overrideSound?: SoundsType;
}

export const Button = (props: ButtonProps) => {
  const {
    type = "button",
    variant,
    size,
    overrideSound = "click",
    asChild = false,
    isLoading = false,
    className,
    onClick,
    children,
    ...rest
  } = props;

  const settings = useSettings();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (settings.sfx) {
      sound.play(overrideSound);
    }

    onClick?.(event);
  };

  const borderedVariant =
    variant === "black" ||
    variant === "white" ||
    variant === "green" ||
    variant === "gray" ||
    variant === "blue"
      ? variant
      : undefined;

  return (
    <ark.button
      asChild={asChild}
      className={cn(
        buttonVariants({ variant, size }),
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
