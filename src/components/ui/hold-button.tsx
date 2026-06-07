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

  const { isHolding, holdHandlers } = useHoldPress({
    durationMs,
    disabled,
    onHoldComplete,
  });

  const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    holdHandlers.onBlur();
    onBlur?.(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    holdHandlers.onClick(event);
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    holdHandlers.onKeyDown(event);
    onKeyDown?.(event);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    holdHandlers.onKeyUp(event);
    onKeyUp?.(event);
  };

  return (
    <Button
      className={cn(
        "touch-manipulation select-none overflow-hidden text-sm [-webkit-touch-callout:none]",
        className
      )}
      clickEffect={false}
      disabled={disabled}
      onBlur={handleBlur}
      onClick={handleClick}
      onContextMenu={holdHandlers.onContextMenu}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseDown={holdHandlers.onMouseDown}
      onMouseLeave={holdHandlers.onMouseLeave}
      onMouseUp={holdHandlers.onMouseUp}
      onTouchCancel={holdHandlers.onTouchCancel}
      onTouchEnd={holdHandlers.onTouchEnd}
      onTouchStart={holdHandlers.onTouchStart}
      {...rest}
    >
      <HoldProgress active={isHolding} durationMs={durationMs} />
      <span className="relative z-10 flex items-center gap-2">
        {isHolding ? holdLabel : children}
      </span>
    </Button>
  );
};

const isHoldKey = (key: string) => key === " " || key === "Enter";

interface HoldProgressProps {
  active: boolean;
  durationMs: number;
}

const HoldProgress = (props: HoldProgressProps) => {
  const { active, durationMs } = props;

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 left-0 w-full origin-left bg-white/25",
        active
          ? "scale-x-100 transition-transform ease-linear"
          : "scale-x-0 transition-none"
      )}
      style={active ? { transitionDuration: `${durationMs}ms` } : undefined}
    />
  );
};

interface UseHoldPressOptions {
  disabled?: boolean;
  durationMs: number;
  onHoldComplete?: () => void;
}

const useHoldPress = (options: UseHoldPressOptions) => {
  const { durationMs, disabled, onHoldComplete } = options;

  const { trigger, cancel } = useWebHaptics();

  const [isHolding, setIsHolding] = React.useState(false);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHoldCompleteRef = React.useRef(onHoldComplete);

  onHoldCompleteRef.current = onHoldComplete;

  const cancelHold = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    sound.stop("hold");
    cancel();
    setIsHolding(false);
  }, [cancel]);

  const startHold = React.useCallback(() => {
    if (disabled || timerRef.current) {
      return;
    }

    trigger("light");
    sound.play("hold");
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      sound.stop("hold");
      setIsHolding(false);
      trigger("success");
      onHoldCompleteRef.current?.();
    }, durationMs);
  }, [disabled, durationMs, trigger]);

  React.useEffect(() => () => cancelHold(), [cancelHold]);

  const holdHandlers = React.useMemo(
    () => ({
      onBlur: cancelHold,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      },
      onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!event.repeat && isHoldKey(event.key)) {
          startHold();
        }
      },
      onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (isHoldKey(event.key)) {
          cancelHold();
        }
      },
      onMouseDown: startHold,
      onMouseLeave: cancelHold,
      onMouseUp: cancelHold,
      onTouchCancel: cancelHold,
      onTouchEnd: cancelHold,
      onTouchStart: (event: React.TouchEvent<HTMLButtonElement>) => {
        event.preventDefault();
        startHold();
      },
    }),
    [cancelHold, startHold]
  );

  return { isHolding, holdHandlers };
};
