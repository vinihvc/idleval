import React from "react";

export const useEffectOnce = (effect: React.EffectCallback) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: effect must run only on mount
  React.useEffect(effect, []);
};
