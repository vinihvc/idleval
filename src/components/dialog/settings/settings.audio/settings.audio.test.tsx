import { describe, expect, test, vi } from "vitest";
import { SettingsAudio } from "@/components/dialog/settings/settings.audio";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("SettingsAudio", () => {
  test("mutes music volume on mute click", async () => {
    const onMusicVolumeChange = vi.fn();
    const screen = await renderWithProviders(
      <SettingsAudio
        musicVolume={0.8}
        onMusicVolumeChange={onMusicVolumeChange}
        onSfxVolumeChange={vi.fn()}
        sfxVolume={0.8}
      />
    );

    await screen
      .getByRole("button", { name: m["ui.settings.muteMusic"]() })
      .click();

    expect(onMusicVolumeChange).toHaveBeenCalledWith(0);
  });
});
