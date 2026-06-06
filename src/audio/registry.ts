import type { SoundCategory, SoundId } from "./types";

export interface SoundDefinition {
  src: string;
  category: SoundCategory;
  volume: number;
  pool?: number;
  throttleMs?: number;
  loop?: boolean;
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
  auto: {
    src: "/sounds/auto.wav",
    category: "sfx",
    volume: 0.5,
    pool: 3,
    throttleMs: 120,
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
