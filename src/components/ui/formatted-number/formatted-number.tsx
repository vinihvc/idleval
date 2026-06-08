import { cn } from "@/lib/cn";
import type { GameValue } from "@/utils/decimal";
import { D } from "@/utils/decimal";
import {
  amountFormatter,
  amountFormatterWithDolarSign,
} from "@/utils/formatters";

interface FormattedNumberProps extends React.ComponentProps<"div"> {
  /**
   * If `true`, the value will be formatted with a dollar sign
   *
   * @default false
   */
  isDollar?: boolean;
  /**
   * The value to display
   */
  value: number | GameValue;
}

export const FormattedNumber = (props: FormattedNumberProps) => {
  const { value, className, isDollar, ...rest } = props;

  const formatted = isDollar
    ? amountFormatterWithDolarSign(D(value))
    : amountFormatter(D(value));

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-number tabular-nums",
        className
      )}
      {...rest}
    >
      {formatted}
    </div>
  );
};
