import React from "react";
import useSoundHook from "use-sound";

export type SoundsType = "click" | "coin" | "upgrade" | "auto";

interface SoundContextType {
  play: (type: SoundsType, volume?: number) => void;
}

const SoundContext = React.createContext<SoundContextType | undefined>(
  undefined
);

// Global reference to store the play function
let globalPlay: ((type: SoundsType, volume?: number) => void) | null = null;

export const SoundProvider = ({ children }: React.PropsWithChildren) => {
  // Refs to store sound players
  const soundPlayers = React.useRef<
    Record<SoundsType, ReturnType<typeof useSoundHook>[0]>
  >({} as Record<SoundsType, ReturnType<typeof useSoundHook>[0]>);

  // Initialize sound players for each type
  const [clickSound] = useSoundHook("/sounds/click.wav");
  const [coinSound] = useSoundHook("/sounds/coin.wav");
  const [upgradeSound] = useSoundHook("/sounds/upgrade.wav");
  const [autoSound] = useSoundHook("/sounds/auto.wav");

  // Store all players in the ref
  soundPlayers.current = {
    click: clickSound,
    coin: coinSound,
    upgrade: upgradeSound,
    auto: autoSound,
  };

  const play = React.useCallback((type: SoundsType, _volume = 1) => {
    const player = soundPlayers.current[type];
    if (player) {
      player();
    }
  }, []);

  // Store the play function in the global reference
  globalPlay = play;

  return (
    <SoundContext.Provider value={{ play }}>{children}</SoundContext.Provider>
  );
};

// Hook for using within React components
export const useSound = () => {
  const context = React.useContext(SoundContext);

  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }

  return context;
};

// Helper for using outside React components
export const sound = {
  play: (type: SoundsType, volume?: number) => {
    if (!globalPlay) {
      console.warn(
        "Sound system not initialized. Make sure SoundProvider is mounted."
      );
      return;
    }
    globalPlay(type, volume);
  },
};
