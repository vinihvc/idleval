import React from "react";
import { describe, expect, test } from "vitest";
import { SettingsAudio } from "@/components/dialog/settings/settings.audio";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

const AudioHarness = () => {
  const [musicVolume, setMusicVolume] = React.useState(0.8);
  const [sfxVolume, setSfxVolume] = React.useState(0.8);

  return (
    <SettingsAudio
      musicVolume={musicVolume}
      onMusicVolumeChange={setMusicVolume}
      onSfxVolumeChange={setSfxVolume}
      sfxVolume={sfxVolume}
    />
  );
};

describe("SettingsAudio", () => {
  test("renders music and sfx sliders with mute controls", async () => {
    const screen = await renderWithProviders(<AudioHarness />);

    await expect
      .element(screen.getByText(m["ui.settings.music"]()))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.settings.sfx"]()))
      .toBeInTheDocument();

    const sliders = screen.getByRole("slider").elements();
    expect(sliders.length).toBe(2);

    await expect
      .element(
        screen.getByRole("button", { name: m["ui.settings.muteMusic"]() })
      )
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.settings.muteSfx"]() }))
      .toBeInTheDocument();
  });

  test("mute toggles music volume to zero and restores on second click", async () => {
    const screen = await renderWithProviders(<AudioHarness />);

    const muteMusic = screen.getByRole("button", {
      name: m["ui.settings.muteMusic"](),
    });

    await muteMusic.click();

    await expect.element(muteMusic).toHaveAttribute("aria-pressed", "true");

    const musicSlider = screen.getByRole("slider", {
      name: m["ui.settings.music"](),
    });
    await expect.element(musicSlider).toHaveAttribute("aria-valuenow", "0");

    await muteMusic.click();

    await expect.element(muteMusic).toHaveAttribute("aria-pressed", "false");
    await expect.element(musicSlider).toHaveAttribute("aria-valuenow", "0.8");
  });
});
