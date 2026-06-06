import { useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { store } from "@/providers/store";

export const settingsAtom = atomWithStorage("settings", {
  music: true,
  musicVolume: 0.8,
  sfx: true,
  sfxVolume: 0.8,
});

export const getSettings = () => store.get(settingsAtom);

export const useSettings = () => useAtomValue(settingsAtom);

export const toggleMusic = () =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    music: !prev.music,
  }));

export const toggleSfx = () =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    sfx: !prev.sfx,
  }));

export const setMusicVolume = (value: number) =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    musicVolume: value,
  }));

export const setSfxVolume = (value: number) =>
  store.set(settingsAtom, (prev) => ({
    ...prev,
    sfxVolume: value,
  }));
