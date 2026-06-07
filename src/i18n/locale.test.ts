import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from "@/i18n/locale";

describe("locale", () => {
  it("supports en, es-MX, and pt-BR", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "es-MX", "pt-BR"]);
  });

  it("normalizeLocale maps language prefixes", () => {
    expect(normalizeLocale("pt-BR")).toBe("pt-BR");
    expect(normalizeLocale("pt")).toBe("pt-BR");
    expect(normalizeLocale("es-MX")).toBe("es-MX");
    expect(normalizeLocale("es-419")).toBe("es-MX");
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("fr-FR")).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("detectBrowserLocale falls back to en without navigator", () => {
    expect(detectBrowserLocale()).toBe(DEFAULT_LOCALE);
  });
});
