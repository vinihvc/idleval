import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from "@/i18n/locale";

describe("locale", () => {
  it("supports en, es, and pt", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "es", "pt"]);
  });

  it("normalizeLocale maps language prefixes", () => {
    expect(normalizeLocale("pt")).toBe("pt");
    expect(normalizeLocale("pt")).toBe("pt");
    expect(normalizeLocale("es")).toBe("es");
    expect(normalizeLocale("es-419")).toBe("es");
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("fr-FR")).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("detectBrowserLocale falls back to en without navigator", () => {
    expect(detectBrowserLocale()).toBe(DEFAULT_LOCALE);
  });
});
