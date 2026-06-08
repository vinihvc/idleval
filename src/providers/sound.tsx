import { useAtomValue } from "jotai";
import React from "react";
import { soundEngine } from "@/audio/engine";
import type { PlayOptions, SfxId } from "@/audio/types";
import { store } from "@/providers/store";
import {
  getSettings,
  setMusicVolume,
  setSfxVolume,
  settingsAtom,
} from "@/store/atoms/settings";

interface SoundContextType {
  musicVolume: number;
  pauseMusic: () => void;
  play: (id: SfxId, options?: PlayOptions) => void;
  playMusic: () => void;
  setMusicVolume: (value: number) => void;
  setSfxVolume: (value: number) => void;
  sfxVolume: number;
  stop: (id: SfxId) => void;
  stopMusic: () => void;
}

const SoundContext = React.createContext<SoundContextType | null>(null);

export type { SfxId as SoundsType } from "@/audio/types";

export const SoundProvider = ({ children }: React.PropsWithChildren) => {
  const { musicVolume, sfxVolume } = useAtomValue(settingsAtom);

  React.useEffect(() => {
    soundEngine.init(getSettings, (callback) =>
      store.sub(settingsAtom, callback)
    );

    const unlock = () => {
      soundEngine.unlock();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      soundEngine.dispose();
    };
  }, []);

  const value = React.useMemo<SoundContextType>(
    () => ({
      musicVolume,
      sfxVolume,
      setMusicVolume,
      setSfxVolume,
      play: (id, options) => {
        soundEngine.play(id, options);
      },
      stop: (id) => {
        soundEngine.stop(id);
      },
      playMusic: () => {
        soundEngine.playMusic();
      },
      stopMusic: () => {
        soundEngine.stopMusic();
      },
      pauseMusic: () => {
        soundEngine.pauseMusic();
      },
    }),
    [musicVolume, sfxVolume]
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = React.useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return context;
};

export const sound = {
  play: (id: SfxId, options?: PlayOptions) => {
    soundEngine.play(id, options);
  },
  stop: (id: SfxId) => {
    soundEngine.stop(id);
  },
  playMusic: () => {
    soundEngine.playMusic();
  },
  stopMusic: () => {
    soundEngine.stopMusic();
  },
  pauseMusic: () => {
    soundEngine.pauseMusic();
  },
};
