import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { store } from "@/store/store";

const settingsAtom = atomWithStorage("settings", {
  music: true,
  musicVolume: 0.8,
  sfx: true,
  sfxVolume: 0.8,
});

export const useSettings = () => useAtomValue(settingsAtom);

/**
 * Toggle the music
 */
export const toggleMusic = () =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    music: !prev.music,
  }));

/**
 * Toggle the sfx
 */
export const toggleSfx = () =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    sfx: !prev.sfx,
  }));

/**
 * Set the music volume
 *
 * @param value - The value to set the music volume to
 */
export const setMusicVolume = (value: number) =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    musicVolume: value,
  }));

/**
 * Set the sfx volume
 *
 * @param value - The value to set the sfx volume to
 */
export const setSfxVolume = (value: number) =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    sfxVolume: value,
  }));
