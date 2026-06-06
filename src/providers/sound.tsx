import React from "react";
import { soundEngine } from "@/audio/engine";
import type { PlayOptions, SfxId } from "@/audio/types";
import { store } from "@/providers/store";
import { getSettings, settingsAtom } from "@/store/atoms/settings";

interface SoundContextType {
  pauseMusic: () => void;
  play: (id: SfxId, options?: PlayOptions) => void;
  playMusic: () => void;
  stopMusic: () => void;
}

const SoundContext = React.createContext<SoundContextType | null>(null);

export type { SfxId as SoundsType } from "@/audio/types";

export const SoundProvider = ({ children }: React.PropsWithChildren) => {
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
      play: (id, options) => {
        soundEngine.play(id, options);
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
    []
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
