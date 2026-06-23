import { beforeEach, describe, expect, test } from "vitest";
import { SettingsAudio } from "@/components/dialog/settings/settings.audio";
import { m } from "@/i18n/messages";
import { store } from "@/providers/store";
import { settingsAtom } from "@/store/atoms/settings";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

describe("SettingsAudio", () => {
  beforeEach(() => {
    resetGame();
    store.set(settingsAtom, {
      musicVolume: 0.8,
      sfxVolume: 0.6,
    });
  });

  test("renders music and sfx sliders with labelled controls", async () => {
    const screen = await renderWithProviders(<SettingsAudio />);

    await expect
      .element(screen.getByText(m["ui.settings.music"]()))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.settings.sfx"]()))
      .toBeInTheDocument();

    const sliders = document.querySelectorAll('[role="slider"]');

    expect(sliders).toHaveLength(2);
    expect(sliders[0]?.getAttribute("aria-labelledby")).toBeTruthy();
    expect(sliders[1]?.getAttribute("aria-labelledby")).toBeTruthy();
  });

  test("marks mute buttons pressed when volume is zero", async () => {
    store.set(settingsAtom, {
      musicVolume: 0,
      sfxVolume: 0.6,
    });

    const screen = await renderWithProviders(<SettingsAudio />);

    const muteMusic = screen.getByRole("button", {
      name: m["ui.settings.muteMusic"](),
    });

    await expect.element(muteMusic).toHaveAttribute("aria-pressed", "true");
  });

  test("restores last music volume when unmuting", async () => {
    const screen = await renderWithProviders(<SettingsAudio />);

    const muteMusic = screen.getByRole("button", {
      name: m["ui.settings.muteMusic"](),
    });

    await muteMusic.click();
    expect(store.get(settingsAtom).musicVolume).toBe(0);

    await muteMusic.click();
    expect(store.get(settingsAtom).musicVolume).toBe(0.8);
  });

  test("reflects seeded music volume on the slider", async () => {
    await renderWithProviders(<SettingsAudio />);

    const sliders = document.querySelectorAll('[role="slider"]');
    const musicSlider = sliders[0];

    expect(musicSlider?.getAttribute("aria-valuenow")).toBe("0.8");
  });
});
