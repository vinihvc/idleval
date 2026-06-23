import "vitest-browser-react";

import { beforeEach, vi } from "vitest";
import { store } from "@/providers/store";
import { settingsAtom } from "@/store/atoms/settings";
import { resetGame } from "@/store/reset";

vi.mock("@/providers/sound", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/providers/sound")>();

  return {
    ...actual,
    sound: {
      play: vi.fn(),
      stop: vi.fn(),
      playMusic: vi.fn(),
      stopMusic: vi.fn(),
      pauseMusic: vi.fn(),
    },
  };
});

beforeEach(() => {
  localStorage.clear();
  resetGame();
  store.set(settingsAtom, {
    musicVolume: 0.8,
    sfxVolume: 0.8,
  });
});
