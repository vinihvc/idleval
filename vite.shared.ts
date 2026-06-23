import path from "node:path";

const rootDir = import.meta.dirname;

export const srcAlias = {
  "@/test": path.resolve(rootDir, "./tests/setup"),
  "@": path.resolve(rootDir, "./src"),
} as const;
