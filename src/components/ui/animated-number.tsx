import { cn } from "@/lib/cn";
import {
  amountFormatter,
  amountFormatterWithDolarSign,
} from "@/utils/formatters";

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

  return (
    <div className={cn("flex items-center gap-1", className)} {...rest}>
      {`${
        isDollar ? amountFormatterWithDolarSign(value) : amountFormatter(value)
      }`}
    </div>
  );
};
