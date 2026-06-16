import { tv } from "tailwind-variants";

const clipSafePadding = [
  {
    clipSafe: true,
    size: "sm",
    class: "p-0.5",
  },
  {
    clipSafe: true,
    size: "md",
    class: "p-[3px]",
  },
  {
    clipSafe: true,
    size: "lg",
    class: "p-1",
  },
  {
    truncateSafe: true,
    size: "sm",
    class: "p-0.5",
  },
  {
    truncateSafe: true,
    size: "md",
    class: "p-[3px]",
  },
  {
    truncateSafe: true,
    size: "lg",
    class: "p-1",
  },
] as const;

/** Extra inset when truncating text that inherits a parent lg stroke (e.g. Button). */
export const borderedTextStrokeInset = "px-1" as const;

export const borderedText = tv({
  base: "[paint-order:stroke_fill]",
  variants: {
    variant: {
      default: ["[-webkit-text-stroke-color:oklch(0.92_0.07_84)]"],
      black: ["[-webkit-text-stroke-color:oklch(0_0_0)]"],
      muted: ["[-webkit-text-stroke-color:oklch(0.18_0.03_55)]"],
      cream: ["[-webkit-text-stroke-color:oklch(0.35_0.05_70)]"],
      brown: ["[-webkit-text-stroke-color:oklch(0.2_0.03_55)]"],
      green: ["[-webkit-text-stroke-color:oklch(0.35_0.1_155)]"],
      stone: ["[-webkit-text-stroke-color:oklch(0.38_0.02_260)]"],
      blue: ["[-webkit-text-stroke-color:oklch(0.35_0.1_250)]"],
      purple: ["[-webkit-text-stroke-color:oklch(0.35_0.1_298)]"],
      teal: ["[-webkit-text-stroke-color:oklch(0.35_0.1_195)]"],
      olive: ["[-webkit-text-stroke-color:oklch(0.35_0.1_120)]"],
      wine: ["[-webkit-text-stroke-color:oklch(0.35_0.12_18)]"],
      ember: ["[-webkit-text-stroke-color:oklch(0.35_0.12_45)]"],
      red: ["[-webkit-text-stroke-color:oklch(0.35_0.12_27)]"],
    },
    size: {
      sm: ["[-webkit-text-stroke-width:2px]"],
      md: ["[-webkit-text-stroke-width:3px]"],
      lg: ["[-webkit-text-stroke-width:4px]"],
    },
    clipSafe: {
      true: "",
      false: "",
    },
    truncateSafe: {
      true: "min-w-0 truncate",
      false: "",
    },
  },
  compoundVariants: [...clipSafePadding],
  defaultVariants: {
    variant: "brown",
    size: "lg",
    clipSafe: false,
    truncateSafe: false,
  },
});
