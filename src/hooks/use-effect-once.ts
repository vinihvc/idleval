import React from "react";

export const useEffectOnce = (effect: React.EffectCallback) => {
  React.useEffect(effect, []);
};
