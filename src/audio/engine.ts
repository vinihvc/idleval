import {
  DEFAULT_POOL_SIZE,
  MUSIC_ID,
  SOUND_REGISTRY,
  type SoundDefinition,
} from "./registry";
import type { PlayOptions, SoundId, SoundSettings } from "./types";

type SettingsGetter = () => SoundSettings;
type SettingsSubscriber = (callback: () => void) => () => void;

type AudioFactory = (src?: string) => HTMLAudioElement;

const defaultAudioFactory: AudioFactory = (src) => new Audio(src);

export class SoundEngine {
  private readonly pools = new Map<SoundId, HTMLAudioElement[]>();
  private readonly poolIndex = new Map<SoundId, number>();
  private readonly lastPlayed = new Map<SoundId, number>();
  private musicElement: HTMLAudioElement | null = null;
  private unlocked = false;
  private musicWantsPlay = false;
  private unsubscribe: (() => void) | null = null;
  private getSettings: SettingsGetter = () => ({
    music: true,
    musicVolume: 0.8,
    sfx: true,
    sfxVolume: 0.8,
  });
  private createAudio: AudioFactory = defaultAudioFactory;

  init(
    getSettings: SettingsGetter,
    subscribe: SettingsSubscriber,
    options?: { createAudio?: AudioFactory }
  ) {
    this.getSettings = getSettings;
    if (options?.createAudio) {
      this.createAudio = options.createAudio;
    }

    this.preload();
    this.unsubscribe?.();
    this.unsubscribe = subscribe(() => {
      this.syncFromSettings();
    });
    this.syncFromSettings();
  }

  unlock() {
    this.unlocked = true;

    if (this.musicWantsPlay) {
      this.playMusic();
    }
  }

  preload() {
    for (const [id, entry] of Object.entries(SOUND_REGISTRY)) {
      const soundId = id as SoundId;
      const definition = entry as SoundDefinition;

      if (definition.category === "music") {
        continue;
      }

      const poolSize = definition.pool ?? DEFAULT_POOL_SIZE;
      const pool: HTMLAudioElement[] = [];

      for (let index = 0; index < poolSize; index += 1) {
        const audio = this.createAudio(definition.src);
        audio.preload = "auto";

        if (definition.loop) {
          audio.loop = true;
        }

        pool.push(audio);
      }

      this.pools.set(soundId, pool);
      this.poolIndex.set(soundId, 0);
    }
  }

  play(id: SoundId, options?: PlayOptions) {
    const definition = SOUND_REGISTRY[id] as SoundDefinition;

    if (definition.category === "music") {
      this.playMusic();
      return;
    }

    const settings = this.getSettings();

    if (!settings.sfx) {
      return;
    }

    if (definition.throttleMs != null) {
      const last = this.lastPlayed.get(id) ?? 0;
      const now = Date.now();

      if (now - last < definition.throttleMs) {
        return;
      }

      this.lastPlayed.set(id, now);
    }

    const audio = this.acquireAudio(id);
    const volume =
      definition.volume * settings.sfxVolume * (options?.volume ?? 1);

    audio.volume = clampVolume(volume);
    audio.playbackRate = options?.rate ?? 1;
    audio.currentTime = 0;

    audio.play().catch(() => {
      // Autoplay or missing asset — ignore silently.
    });
  }

  playMusic() {
    const settings = this.getSettings();

    if (!settings.music) {
      this.musicWantsPlay = false;
      this.stopMusic();
      return;
    }

    this.musicWantsPlay = true;

    if (!this.unlocked) {
      return;
    }

    const definition = SOUND_REGISTRY[MUSIC_ID];

    if (!this.musicElement) {
      this.musicElement = this.createAudio(definition.src);
      this.musicElement.loop = true;
      this.musicElement.preload = "auto";
    }

    this.musicElement.volume = clampVolume(
      definition.volume * settings.musicVolume
    );

    this.musicElement.play().catch(() => {
      // Autoplay blocked until user interaction.
    });
  }

  stopMusic() {
    this.musicWantsPlay = false;

    if (!this.musicElement) {
      return;
    }

    this.musicElement.pause();
    this.musicElement.currentTime = 0;
  }

  pauseMusic() {
    this.musicElement?.pause();
  }

  dispose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.stopMusic();
    this.pools.clear();
    this.poolIndex.clear();
    this.lastPlayed.clear();
    this.musicElement = null;
    this.unlocked = false;
    this.musicWantsPlay = false;
  }

  private syncFromSettings() {
    const settings = this.getSettings();

    if (this.musicElement) {
      const definition = SOUND_REGISTRY[MUSIC_ID];
      this.musicElement.volume = clampVolume(
        definition.volume * settings.musicVolume
      );
    }

    if (settings.music && this.unlocked) {
      this.playMusic();
      return;
    }

    this.stopMusic();
  }

  private acquireAudio(id: SoundId): HTMLAudioElement {
    const pool = this.pools.get(id);

    if (!pool || pool.length === 0) {
      return this.createAudio(SOUND_REGISTRY[id].src);
    }

    const index = this.poolIndex.get(id) ?? 0;
    const audio = pool[index];

    this.poolIndex.set(id, (index + 1) % pool.length);

    return audio;
  }
}

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const soundEngine = new SoundEngine();
