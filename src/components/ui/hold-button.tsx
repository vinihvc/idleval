import { useLongPress } from "@uidotdev/usehooks";
import React from "react";
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

export const HoldButton = (props: HoldButtonProps) => {
  const {
    disabled,
    durationMs = 1000,
    holdLabel = "Hold...",
    onClick,
    onHoldComplete,
    onBlur,
    onKeyDown,
    onKeyUp,
    children,
    className,
    ...rest
  } = props;

  const [isHolding, setIsHolding] = React.useState(false);
  const keyboardHoldRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const completeHold = React.useCallback(() => {
    setIsHolding(false);
    onHoldComplete?.();
  }, [onHoldComplete]);

  const clearKeyboardHold = React.useCallback(() => {
    if (keyboardHoldRef.current) {
      clearTimeout(keyboardHoldRef.current);
      keyboardHoldRef.current = null;
    }
    setIsHolding(false);
  }, []);

  const startKeyboardHold = React.useCallback(() => {
    if (disabled || keyboardHoldRef.current) {
      return;
    }

    setIsHolding(true);
    keyboardHoldRef.current = setTimeout(() => {
      keyboardHoldRef.current = null;
      completeHold();
    }, durationMs);
  }, [completeHold, disabled, durationMs]);

  const longPressHandlers = useLongPress(
    () => {
      if (!disabled) {
        completeHold();
      }
    },
    {
      onCancel: () => {
        if (!disabled) {
          setIsHolding(false);
        }
      },
      onStart: () => {
        if (!disabled) {
          setIsHolding(true);
        }
      },
      threshold: durationMs,
    }
  );

  return (
    <Button
      className={cn("overflow-hidden", className)}
      disabled={disabled}
      onBlur={(event) => {
        clearKeyboardHold();
        onBlur?.(event);
      }}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          startKeyboardHold();
        }
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") {
          clearKeyboardHold();
        }
        onKeyUp?.(event);
      }}
      {...longPressHandlers}
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
