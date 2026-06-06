export type SoundCategory = "sfx" | "music";

export interface PlayOptions {
  volume?: number;
  rate?: number;
}

export type SfxId = "click" | "coin" | "upgrade" | "auto" | "pray";

export type MusicId = "theme";

export type SoundId = SfxId | MusicId;

export interface SoundSettings {
  music: boolean;
  musicVolume: number;
  sfx: boolean;
  sfxVolume: number;
}
