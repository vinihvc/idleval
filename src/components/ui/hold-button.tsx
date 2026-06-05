import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface HoldActionButtonProps extends ButtonProps {
  buttonComponent?: React.ComponentType<ButtonProps>;
  durationMs?: number;
  holdingChildren?: React.ReactNode;
  onHoldComplete?: () => void;
}

export const HoldActionButton = (props: HoldActionButtonProps) => {
  const {
    buttonComponent: Component = Button,
    className,
    disabled,
    durationMs = 1000,
    holdingChildren = "Hold...",
    onClick,
    onHoldComplete,
    onKeyDown,
    onKeyUp,
    onPointerCancel,
    onPointerDown,
    onPointerLeave,
    onPointerUp,
    children,
    ...rest
  } = props;

  const [isHolding, setIsHolding] = useState(false);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setIsHolding(false);
  };

  const startHold = () => {
    if (disabled || holdTimeoutRef.current) {
      return;
    }

    setIsHolding(true);
    holdTimeoutRef.current = setTimeout(() => {
      holdTimeoutRef.current = null;
      setIsHolding(false);
      onHoldComplete?.();
    }, durationMs);
  };

  useEffect(
    () => () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    },
    []
  );

  return (
    <Component
      className={cn("overflow-hidden", className)}
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          startHold();
        }
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") {
          clearHold();
        }
        onKeyUp?.(event);
      }}
      onPointerCancel={(event) => {
        clearHold();
        onPointerCancel?.(event);
      }}
      onPointerDown={(event) => {
        if (event.button === 0) {
          startHold();
        }
        onPointerDown?.(event);
      }}
      onPointerLeave={(event) => {
        clearHold();
        onPointerLeave?.(event);
      }}
      onPointerUp={(event) => {
        clearHold();
        onPointerUp?.(event);
      }}
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
        {isHolding ? holdingChildren : children}
      </span>
    </Component>
  );
};
