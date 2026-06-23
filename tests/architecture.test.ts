import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = join(process.cwd(), "src");
const TS_FILE_PATTERN = /\.(ts|tsx)$/;

const collectSourceFiles = (directory: string): string[] => {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.name === "node_modules" || entry.name === "paraglide") {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (TS_FILE_PATTERN.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
};

const getImportPaths = (source: string): string[] => {
  const imports: string[] = [];
  const pattern = /from ["'](@\/[^"']+)["']/g;

  for (const match of source.matchAll(pattern)) {
    imports.push(match[1]);
  }

  return imports;
};

const filesUnder = (prefix: string) =>
  collectSourceFiles(join(SRC_ROOT, prefix)).map((file) =>
    relative(SRC_ROOT, file)
  );

describe("architecture import boundaries", () => {
  it("keeps content free of game, store, and react", () => {
    const violations: string[] = [];

    for (const file of filesUnder("content")) {
      const source = readFileSync(join(SRC_ROOT, file), "utf8");

      for (const importPath of getImportPaths(source)) {
        if (
          importPath.startsWith("@/game/") ||
          importPath.startsWith("@/store/") ||
          importPath.startsWith("react")
        ) {
          violations.push(`${file} -> ${importPath}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps game free of react, components, and store except settings locale", () => {
    const violations: string[] = [];

    for (const file of filesUnder("game")) {
      const source = readFileSync(join(SRC_ROOT, file), "utf8");

      for (const importPath of getImportPaths(source)) {
        if (
          importPath.startsWith("react") ||
          importPath.startsWith("@/components/") ||
          importPath.startsWith("@/i18n/") ||
          (importPath.startsWith("@/store/") &&
            importPath !== "@/store/atoms/settings")
        ) {
          violations.push(`${file} -> ${importPath}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps store free of components and i18n except settings locale", () => {
    const violations: string[] = [];

    for (const file of filesUnder("store")) {
      const source = readFileSync(join(SRC_ROOT, file), "utf8");

      for (const importPath of getImportPaths(source)) {
        if (importPath.startsWith("@/components/")) {
          violations.push(`${file} -> ${importPath}`);
        }

        if (
          importPath.startsWith("@/i18n/") &&
          file !== "store/atoms/settings.ts"
        ) {
          violations.push(`${file} -> ${importPath}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
