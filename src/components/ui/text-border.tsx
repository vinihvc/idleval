import { tv } from "tailwind-variants";

export const borderedText = tv({
  base: "[paint-order:stroke_fill]",
  variants: {
    variant: {
      white: ["[-webkit-text-stroke-color:oklch(0.35_0.05_70)]"],
      gold: ["[-webkit-text-stroke-color:oklch(0.28_0.06_70)]"],
      black: ["[-webkit-text-stroke-color:oklch(0.2_0.03_55)]"],
      green: ["[-webkit-text-stroke-color:oklch(0.35_0.1_155)]"],
      gray: ["[-webkit-text-stroke-color:oklch(0.25_0.03_60)]"],
      blue: ["[-webkit-text-stroke-color:oklch(0.35_0.1_250)]"],
    },
    size: {
      sm: ["[-webkit-text-stroke-width:1px]"],
      md: ["[-webkit-text-stroke-width:2px]"],
      lg: ["[-webkit-text-stroke-width:3px]"],
    },
  },
  defaultVariants: {
    variant: "black",
    size: "md",
  },
});
