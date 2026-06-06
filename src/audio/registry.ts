import type { SoundCategory, SoundId } from "./types";

export interface SoundDefinition {
  category: SoundCategory;
  loop?: boolean;
  pool?: number;
  src: string;
  throttleMs?: number;
  volume: number;
}

export const SOUND_REGISTRY = {
  click: {
    src: "/sounds/click.wav",
    category: "sfx",
    volume: 0.6,
  },
  coin: {
    src: "/sounds/coin.wav",
    category: "sfx",
    volume: 0.7,
    pool: 4,
    throttleMs: 120,
  },
  upgrade: {
    src: "/sounds/upgrade.wav",
    category: "sfx",
    volume: 0.8,
  },
  pray: {
    src: "/sounds/pray.wav",
    category: "sfx",
    volume: 0.9,
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
