import React from "react";
import { useWebHaptics } from "web-haptics/react";
import { cn } from "@/lib/cn";
import { sound } from "@/providers/sound";
import { Button, type ButtonProps } from "./button";

interface HoldButtonProps extends ButtonProps {
  /**
   * The duration of the hold in milliseconds
   *
   * @default 3400
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
    durationMs = 3400,
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

  const stopHoldSound = () => {
    sound.stop("hold");
  };

  const cancelHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopHoldSound();
    cancel();
    setIsHolding(false);
  };

  const startHold = () => {
    if (disabled || timerRef.current) {
      return;
    }

    trigger("light");
    sound.play("hold");
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      stopHoldSound();
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
      className={cn(
        "touch-manipulation select-none overflow-hidden [-webkit-touch-callout:none]",
        className
      )}
      disabled={disabled}
      onBlur={(event) => {
        cancelHold();
        onBlur?.(event);
      }}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      onContextMenu={(event) => event.preventDefault()}
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
      onTouchCancel={cancelHold}
      onTouchEnd={cancelHold}
      onTouchStart={(event) => {
        event.preventDefault();
        startHold();
      }}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-full origin-left select-none bg-white/25",
          isHolding
            ? "scale-x-100 transition-transform ease-linear"
            : "scale-x-0 transition-none"
        )}
        style={
          isHolding ? { transitionDuration: `${durationMs}ms` } : undefined
        }
      />
      <span className="relative z-10 flex items-center gap-2">
        {isHolding ? holdLabel : children}
      </span>
    </Button>
  );
};
