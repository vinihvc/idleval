export type SoundCategory = "sfx" | "music";

export interface PlayOptions {
  rate?: number;
  volume?: number;
}

export type SfxId = "click" | "coin" | "hold" | "upgrade" | "pray";

export type MusicId = "theme";

export type SoundId = SfxId | MusicId;

export interface SoundSettings {
  music: boolean;
  musicVolume: number;
  sfx: boolean;
  sfxVolume: number;
}
