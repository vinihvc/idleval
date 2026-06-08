import { lazy } from "react";

export const LazyDebugTools = lazy(() =>
  import("./debug-tools").then((m) => ({ default: m.DebugTools }))
);
