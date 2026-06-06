import React from "react";
import { useWebHaptics } from "web-haptics/react";
import { cn } from "@/lib/cn";
import { Button, type ButtonProps } from "./button";

interface HoldButtonProps extends ButtonProps {
  /**
   * The duration of the hold in milliseconds
   *
   * @default 1000
   */
  durationMs?: number;
  /**
   * Content shown while the button is being held
   *
   * @default "Hold..."
   */
  holdLabel?: React.ReactNode;
  /**
   * The function to call when the hold is complete
   */
  onHoldComplete?: () => void;
}

const isHoldKey = (key: string) => key === " " || key === "Enter";

export const HoldButton = (props: HoldButtonProps) => {
  const {
    durationMs = 1000,
    holdLabel = "Hold...",
    disabled,
    onClick,
    onHoldComplete,
    onBlur,
    onKeyDown,
    onKeyUp,
    className,
    children,
    ...rest
  } = props;

  const { trigger, cancel } = useWebHaptics();
  const [isHolding, setIsHolding] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    cancel();
    setIsHolding(false);
  };

  const startHold = () => {
    if (disabled || timerRef.current) {
      return;
    }

    trigger("light");
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIsHolding(false);
      trigger("success");
      onHoldComplete?.();
    }, durationMs);
  };

  React.useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  return (
    <Button
      className={cn("overflow-hidden", className)}
      disabled={disabled}
      onBlur={(event) => {
        cancelHold();
        onBlur?.(event);
      }}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        if (isHoldKey(event.key)) {
          startHold();
        }
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (isHoldKey(event.key)) {
          cancelHold();
        }
        onKeyUp?.(event);
      }}
      onMouseDown={startHold}
      onMouseLeave={cancelHold}
      onMouseUp={cancelHold}
      onTouchEnd={cancelHold}
      onTouchStart={startHold}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-white/25 transition-transform ease-linear",
          isHolding && "scale-x-100"
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {isHolding ? holdLabel : children}
      </span>
    </Button>
  );
};
