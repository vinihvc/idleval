import { tv } from "tailwind-variants";

export const borderedText = tv({
  base: "[paint-order:stroke_fill]",
  variants: {
    variant: {
      default: ["[-webkit-text-stroke-color:oklch(0.92_0.07_84)]"],
      cream: ["[-webkit-text-stroke-color:oklch(0.35_0.05_70)]"],
      brown: ["[-webkit-text-stroke-color:oklch(0.2_0.03_55)]"],
      green: ["[-webkit-text-stroke-color:oklch(0.35_0.1_155)]"],
      stone: ["[-webkit-text-stroke-color:oklch(0.25_0.03_60)]"],
      blue: ["[-webkit-text-stroke-color:oklch(0.35_0.1_250)]"],
      purple: ["[-webkit-text-stroke-color:oklch(0.35_0.1_298)]"],
      red: ["[-webkit-text-stroke-color:oklch(0.35_0.12_27)]"],
    },
    size: {
      sm: ["[-webkit-text-stroke-width:2px]"],
      md: ["[-webkit-text-stroke-width:3px]"],
      lg: ["[-webkit-text-stroke-width:4px]"],
    },
  },
  defaultVariants: {
    variant: "brown",
    size: "lg",
  },
});
