export type SoundCategory = "sfx" | "music";

export interface PlayOptions {
  rate?: number;
  volume?: number;
}

export type SfxId = "click" | "coin" | "hold" | "upgrade";

export type MusicId = "theme";

export type SoundId = SfxId | MusicId;

export interface SoundSettings {
  musicVolume: number;
  sfxVolume: number;
}
