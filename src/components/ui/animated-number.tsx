import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/cn";
import { getAmountForNumberFlow } from "@/utils/formatters";

const amountFormat = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
} as const;

interface AnimatedNumberProps extends React.ComponentProps<"div"> {
  /**
   * If `true`, the value will be formatted with a dollar sign
   *
   * @default false
   */
  isDollar?: boolean;
  /**
   * The value to display
   */
  value: number;
}

export const AnimatedNumber = (props: AnimatedNumberProps) => {
  const { value, className, isDollar, ...rest } = props;
  const display = getAmountForNumberFlow(value);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-number tabular-nums",
        className
      )}
      {...rest}
    >
      {display.kind === "infinity" ? (
        <span>{isDollar ? "$∞" : "∞"}</span>
      ) : (
        <NumberFlow
          format={amountFormat}
          prefix={isDollar ? "$" : undefined}
          suffix={display.suffix}
          value={display.value}
        />
      )}
    </div>
  );
};
