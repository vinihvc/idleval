import type { SoundCategory, SoundId } from "./types";

export interface SoundDefinition {
  /**
   * "sfx" or "music".
   */
  category: SoundCategory;
  /**
   * Loop playback.
   */
  loop?: boolean;
  /**
   * Concurrent playback instances.
   */
  pool?: number;
  /**
   * Audio file path.
   */
  src: string;
  /**
   * Min interval between plays (ms).
   */
  throttleMs?: number;
  /**
   * Base volume (0–1).
   */
  volume: number;
}

export const SOUND_REGISTRY = {
  click: {
    src: "/sounds/click.wav",
    category: "sfx",
    volume: 0.4,
  },
  coin: {
    src: "/sounds/coin.wav",
    category: "sfx",
    volume: 0.5,
    pool: 4,
    throttleMs: 120,
  },
  upgrade: {
    src: "/sounds/upgrade.wav",
    category: "sfx",
    volume: 0.5,
  },
  pray: {
    src: "/sounds/pray.wav",
    category: "sfx",
    volume: 0.9,
  },
  hold: {
    src: "/sounds/hold.wav",
    category: "sfx",
    volume: 0.6,
    loop: true,
  },

  theme: {
    src: "/sounds/music.wav",
    category: "music",
    volume: 0.4,
    loop: true,
  },
} as const satisfies Record<SoundId, SoundDefinition>;

export const MUSIC_ID = "theme" as const;

export const DEFAULT_POOL_SIZE = 1;
