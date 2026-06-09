import React from "react";
import { useWebHaptics } from "web-haptics/react";
import { sound } from "@/providers/sound";

const isHoldKey = (key: string) => key === " " || key === "Enter";

interface UseHoldPressOptions {
  disabled?: boolean;
  durationMs?: number;
  onHoldComplete?: () => void;
}

export const useHoldPress = (options: UseHoldPressOptions) => {
  const { durationMs = 3400, disabled, onHoldComplete } = options;

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
        if (isHoldKey(event.key)) {
          event.preventDefault();
          if (!event.repeat) {
            startHold();
          }
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
