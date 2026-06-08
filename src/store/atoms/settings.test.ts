import { beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "@/providers/store";
import {
  getDifficultyLevel,
  getLocale,
  getSettings,
  resolveInitialLocale,
  setDifficulty,
  setLocale,
  settingsAtom,
} from "./settings";

describe("settings", () => {
  beforeEach(() => {
    store.set(settingsAtom, {
      difficulty: "medium",
      musicVolume: 0.8,
      sfxVolume: 0.8,
    });
  });

  it("defaults difficulty to medium", () => {
    expect(getDifficultyLevel()).toBe("medium");
  });

  it("setDifficulty updates persisted settings", () => {
    setDifficulty("hard");

    expect(store.get(settingsAtom).difficulty).toBe("hard");
    expect(getSettings().difficulty).toBe("hard");
  });

  it("getSettings normalizes invalid difficulty values", () => {
    store.set(settingsAtom, (prev) => ({
      ...prev,
      difficulty: "unknown" as never,
    }));

    expect(getSettings().difficulty).toBe("medium");
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
