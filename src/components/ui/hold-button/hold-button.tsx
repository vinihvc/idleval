import type React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useHoldPress } from "@/hooks/use-hold-press";
import { cn } from "@/lib/cn";

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
      aria-busy={isHolding || undefined}
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
      sound={false}
      {...rest}
    >
      <HoldProgress active={isHolding} durationMs={durationMs} />
      <span className="relative z-10 flex items-center gap-2">
        {isHolding ? holdLabel : children}
      </span>
    </Button>
  );
};

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
