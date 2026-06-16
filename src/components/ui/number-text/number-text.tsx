import type React from "react";
import type { VariantProps } from "tailwind-variants";
import { borderedText } from "@/components/ui/text-border";
import { cn } from "@/lib/cn";

interface NumberTextProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof borderedText> {
  /** When false, inherit stroke from a bordered parent (e.g. Button). @default true */
  bordered?: boolean;
}

export const NumberText = (props: NumberTextProps) => {
  const {
    variant,
    size,
    truncateSafe,
    bordered = true,
    className,
    ...rest
  } = props;

  return (
    <span
      className={cn(
        "font-number text-lg tabular-nums",
        bordered && borderedText({ variant, size, truncateSafe }),
        className
      )}
      {...rest}
    />
  );
};
