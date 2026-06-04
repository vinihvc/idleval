import React from "react";

type IntervalFunction = () => unknown;

/**
 * Hook that fixes the delay of setInterval
 *
 * @param handler a handler function to be called when clicked outside
 * @param delay the delay in milliseconds
 */
export const useInterval = (handler: IntervalFunction, delay?: number) => {
  const savedCallback = React.useRef<IntervalFunction | null>(null);

  React.useEffect(() => {
    if (!delay) {
      return;
    }

    savedCallback.current = handler;
  });

  React.useEffect(() => {
    if (!delay) {
      return;
    }

    const tick = () => {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    };
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
};
