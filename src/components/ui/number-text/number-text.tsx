import type React from "react";
import type { VariantProps } from "tailwind-variants";
import { borderedText } from "@/components/ui/text-border";
import { cn } from "@/lib/cn";

interface NumberTextProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof borderedText> {}

export const NumberText = (props: NumberTextProps) => {
  const { variant, size, className, ...rest } = props;

  return (
    <span
      className={cn(
        "font-number text-lg tabular-nums",
        borderedText({ variant, size }),
        className
      )}
      {...rest}
    />
  );
};
