import path from "node:path";

export const srcAlias = {
  "@": path.resolve(import.meta.dirname, "./src"),
} as const;
