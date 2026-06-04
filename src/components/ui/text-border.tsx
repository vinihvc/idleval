import { tv } from "tailwind-variants";

export const borderedText = tv({
  base: "[paint-order:stroke_fill]",
  variants: {
    variant: {
      white: ["[-webkit-text-stroke-color:theme(colors.neutral.300)]"],
      black: ["[-webkit-text-stroke-color:theme(colors.neutral.700)]"],
      green: ["[-webkit-text-stroke-color:theme(colors.green.800)]"],
      gray: ["[-webkit-text-stroke-color:theme(colors.neutral.800)]"],
      blue: ["[-webkit-text-stroke-color:theme(colors.blue.800)]"],
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
