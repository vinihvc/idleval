import { beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "@/providers/store";
import {
  getLocale,
  getSettings,
  resolveInitialLocale,
  setLocale,
  settingsAtom,
} from "@/store/atoms/settings";

describe("settings", () => {
  beforeEach(() => {
    store.set(settingsAtom, {
      musicVolume: 0.8,
      sfxVolume: 0.8,
    });
  });

  it("setLocale persists normalized locale", () => {
    setLocale("pt");

    expect(getLocale()).toBe("pt");
    expect(getSettings().locale).toBe("pt");
  });

  it("resolveInitialLocale detects browser locale when unset", () => {
    vi.stubGlobal("navigator", {
      language: "es",
      languages: ["es", "en"],
    });

    expect(resolveInitialLocale()).toBe("es");
    expect(getLocale()).toBe("es");

    vi.unstubAllGlobals();
  });
});
