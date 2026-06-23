import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const FONT_FILE_PATTERN = /\.woff2?$/;
const PRECACHE_URL_PATTERN = /\{url:"([^"]+)"/g;

const distDirectory = path.resolve(import.meta.dirname, "../../dist");
const serviceWorkerPath = path.join(distDirectory, "sw.js");

const listFiles = (directory: string, prefix = ""): string[] => {
  const entries: string[] = [];

  for (const entry of readdirSync(directory)) {
    const relativePath = path.join(prefix, entry);
    const absolutePath = path.join(directory, entry);

    if (statSync(absolutePath).isDirectory()) {
      entries.push(...listFiles(absolutePath, relativePath));
      continue;
    }

    entries.push(relativePath.replace(/\\/g, "/"));
  }

  return entries;
};

const extractPrecachedUrls = (serviceWorkerSource: string) =>
  [...serviceWorkerSource.matchAll(PRECACHE_URL_PATTERN)].map(
    (match) => match[1]
  );

describe.skipIf(!existsSync(serviceWorkerPath))("pwa precache", () => {
  test("precaches every font asset emitted to dist/assets", () => {
    const serviceWorkerSource = readFileSync(serviceWorkerPath, "utf8");
    const precachedUrls = new Set(extractPrecachedUrls(serviceWorkerSource));
    const assetFiles = listFiles(path.join(distDirectory, "assets"));
    const fontFiles = assetFiles.filter((file) => FONT_FILE_PATTERN.test(file));

    expect(fontFiles.length).toBeGreaterThan(0);

    for (const fontFile of fontFiles) {
      expect(precachedUrls.has(`assets/${fontFile}`)).toBe(true);
    }
  });

  test("precaches the app shell and manifest", () => {
    const serviceWorkerSource = readFileSync(serviceWorkerPath, "utf8");
    const precachedUrls = new Set(extractPrecachedUrls(serviceWorkerSource));

    expect(precachedUrls.has("index.html")).toBe(true);
    expect(precachedUrls.has("manifest.webmanifest")).toBe(true);
    expect(
      [...precachedUrls].some((url) => url.startsWith("assets/index-"))
    ).toBe(true);
  });
});
