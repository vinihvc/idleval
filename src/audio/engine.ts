import { MUSIC_ID, SOUND_REGISTRY, type SoundDefinition } from "./registry";
import type { PlayOptions, SoundId, SoundSettings } from "./types";

type SettingsGetter = () => SoundSettings;
type SettingsSubscriber = (callback: () => void) => () => void;
type AudioContextFactory = () => AudioContext;
type FetchAudioFn = (src: string) => Promise<ArrayBuffer>;

const defaultFetchAudio = async (src: string) => {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Failed to load audio: ${src}`);
  }

  return response.arrayBuffer();
};

const clearMediaSession = () => {
  if (!("mediaSession" in navigator)) {
    return;
  }

  navigator.mediaSession.metadata = null;
  navigator.mediaSession.playbackState = "none";
};

export class SoundEngine {
  private context: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private readonly buffers = new Map<SoundId, AudioBuffer>();
  private readonly activeSources = new Map<
    SoundId,
    Set<AudioBufferSourceNode>
  >();
  private musicSource: AudioBufferSourceNode | null = null;
  private readonly lastPlayed = new Map<SoundId, number>();
  private unlocked = false;
  private musicWantsPlay = false;
  private unsubscribe: (() => void) | null = null;
  private getSettings: SettingsGetter = () => ({
    musicVolume: 0.8,
    sfxVolume: 0.8,
  });
  private createContext: AudioContextFactory = () => new AudioContext();
  private fetchAudio: FetchAudioFn = defaultFetchAudio;

  init(
    getSettings: SettingsGetter,
    subscribe: SettingsSubscriber,
    options?: {
      createContext?: AudioContextFactory;
      fetchAudio?: FetchAudioFn;
      preloadBuffers?: Partial<Record<SoundId, AudioBuffer>>;
    }
  ) {
    this.getSettings = getSettings;

    if (options?.createContext) {
      this.createContext = options.createContext;
    }

    if (options?.fetchAudio) {
      this.fetchAudio = options.fetchAudio;
    }

    this.ensureContext();

    if (options?.preloadBuffers) {
      for (const [id, buffer] of Object.entries(options.preloadBuffers)) {
        if (buffer) {
          this.buffers.set(id as SoundId, buffer);
        }
      }
    } else {
      this.loadBuffers().catch(() => undefined);
    }
    this.unsubscribe?.();
    this.unsubscribe = subscribe(() => {
      this.syncFromSettings();
    });
    this.syncFromSettings();
  }

  unlock() {
    this.unlocked = true;
    clearMediaSession();

    this.context?.resume().catch(() => undefined);

    if (this.musicWantsPlay) {
      this.playMusic();
    }
  }

  preload() {
    this.loadBuffers().catch(() => undefined);
  }

  play(id: SoundId, options?: PlayOptions) {
    const definition = SOUND_REGISTRY[id] as SoundDefinition;

    if (definition.category === "music") {
      this.playMusic();
      return;
    }

    const settings = this.getSettings();

    if (settings.sfxVolume <= 0) {
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

    const buffer = this.buffers.get(id);

    if (!(buffer && this.context && this.sfxGain)) {
      return;
    }

    if (this.context.state === "suspended" && this.unlocked) {
      this.context.resume().catch(() => undefined);
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = definition.loop ?? false;
    source.playbackRate.value = options?.rate ?? 1;

    const gain = this.context.createGain();
    gain.gain.value = clampVolume(
      definition.volume * settings.sfxVolume * (options?.volume ?? 1)
    );

    source.connect(gain);
    gain.connect(this.sfxGain);

    const sources =
      this.activeSources.get(id) ?? new Set<AudioBufferSourceNode>();
    sources.add(source);
    this.activeSources.set(id, sources);

    source.onended = () => {
      sources.delete(source);
      source.disconnect();
      gain.disconnect();
    };

    try {
      source.start(0);
    } catch {
      sources.delete(source);
      source.disconnect();
      gain.disconnect();
    }
  }

  stop(id: SoundId) {
    const definition = SOUND_REGISTRY[id] as SoundDefinition;

    if (definition.category === "music") {
      this.stopMusic();
      return;
    }

    const sources = this.activeSources.get(id);

    if (!sources) {
      return;
    }

    for (const source of sources) {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }

      source.disconnect();
    }

    sources.clear();
  }

  playMusic() {
    const settings = this.getSettings();

    if (settings.musicVolume <= 0) {
      this.musicWantsPlay = false;
      this.stopMusic();
      return;
    }

    this.musicWantsPlay = true;

    if (!this.unlocked) {
      return;
    }

    const definition = SOUND_REGISTRY[MUSIC_ID];

    if (this.musicGain) {
      this.musicGain.gain.value = clampVolume(
        definition.volume * settings.musicVolume
      );
    }

    if (this.musicSource) {
      return;
    }

    const buffer = this.buffers.get(MUSIC_ID);

    if (!(buffer && this.context && this.musicGain)) {
      return;
    }

    if (this.context.state === "suspended") {
      this.context.resume().catch(() => undefined);
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.musicGain);

    source.onended = () => {
      if (this.musicSource === source) {
        this.musicSource = null;
      }
    };

    this.musicSource = source;

    try {
      source.start(0);
    } catch {
      this.musicSource = null;
      source.disconnect();
    }
  }

  stopMusic() {
    this.musicWantsPlay = false;

    if (!this.musicSource) {
      return;
    }

    try {
      this.musicSource.stop();
    } catch {
      // Already stopped.
    }

    this.musicSource.disconnect();
    this.musicSource = null;
  }

  pauseMusic() {
    if (!this.musicSource) {
      return;
    }

    try {
      this.musicSource.stop();
    } catch {
      // Already stopped.
    }

    this.musicSource.disconnect();
    this.musicSource = null;
  }

  dispose() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.stopMusic();

    for (const sources of this.activeSources.values()) {
      for (const source of sources) {
        try {
          source.stop();
        } catch {
          // Already stopped.
        }

        source.disconnect();
      }
    }

    this.activeSources.clear();
    this.buffers.clear();
    this.lastPlayed.clear();
    this.context?.close().catch(() => undefined);
    this.context = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.unlocked = false;
    this.musicWantsPlay = false;
  }

  private syncFromSettings() {
    const settings = this.getSettings();

    if (this.musicGain) {
      const definition = SOUND_REGISTRY[MUSIC_ID];
      this.musicGain.gain.value = clampVolume(
        definition.volume * settings.musicVolume
      );
    }

    if (settings.musicVolume > 0 && this.unlocked) {
      this.playMusic();
      return;
    }

    this.stopMusic();
  }

  private ensureContext() {
    if (this.context) {
      return;
    }

    this.context = this.createContext();
    this.sfxGain = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.sfxGain.gain.value = 1;
    this.musicGain.gain.value = 1;
    this.sfxGain.connect(this.context.destination);
    this.musicGain.connect(this.context.destination);
  }

  private async loadBuffers() {
    this.ensureContext();

    const context = this.context;

    if (!context) {
      return;
    }

    const entries = Object.entries(SOUND_REGISTRY) as [
      SoundId,
      SoundDefinition,
    ][];

    await Promise.all(
      entries.map(async ([soundId, definition]) => {
        try {
          const data = await this.fetchAudio(definition.src);
          const buffer = await context.decodeAudioData(data.slice(0));

          if (buffer) {
            this.buffers.set(soundId, buffer);
          }
        } catch {
          // Missing asset or decode failure — ignore silently.
        }
      })
    );
  }
}

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const soundEngine = new SoundEngine();
