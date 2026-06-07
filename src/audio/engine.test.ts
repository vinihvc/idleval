import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SoundEngine } from "./engine";
import type { SoundId } from "./types";

interface MockGainNode {
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  gain: { value: number };
}

interface MockBufferSource {
  buffer: AudioBuffer | null;
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  loop: boolean;
  onended: (() => void) | null;
  playbackRate: { value: number };
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
}

const createMockBuffer = () => ({}) as AudioBuffer;

const createMockWebAudio = () => {
  const sources: MockBufferSource[] = [];
  const gains: MockGainNode[] = [];
  const destination = {} as AudioDestinationNode;

  const createGain = vi.fn(() => {
    const gain: MockGainNode = {
      gain: { value: 1 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    gains.push(gain);
    return gain as unknown as GainNode;
  });

  const createBufferSource = vi.fn(() => {
    const source: MockBufferSource = {
      buffer: null,
      loop: false,
      playbackRate: { value: 1 },
      onended: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    sources.push(source);
    return source as unknown as AudioBufferSourceNode;
  });

  const context = {
    state: "running" as AudioContextState,
    destination,
    createGain,
    createBufferSource,
    decodeAudioData: vi.fn().mockResolvedValue(createMockBuffer()),
    resume: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  } as unknown as AudioContext;

  const preloadBuffers = Object.fromEntries(
    (["click", "coin", "upgrade", "hold", "theme"] as SoundId[]).map((id) => [
      id,
      createMockBuffer(),
    ])
  ) as Partial<Record<SoundId, AudioBuffer>>;

  return { context, sources, gains, preloadBuffers };
};

describe("SoundEngine", () => {
  let engine: SoundEngine;
  let settings: {
    music: boolean;
    musicVolume: number;
    sfx: boolean;
    sfxVolume: number;
  };
  let mockWebAudio: ReturnType<typeof createMockWebAudio>;

  beforeEach(() => {
    vi.useFakeTimers();

    engine = new SoundEngine();
    settings = {
      music: true,
      musicVolume: 0.8,
      sfx: true,
      sfxVolume: 0.8,
    };
    mockWebAudio = createMockWebAudio();

    engine.init(
      () => settings,
      (callback) => {
        callback();
        return () => undefined;
      },
      {
        createContext: () => mockWebAudio.context,
        preloadBuffers: mockWebAudio.preloadBuffers,
      }
    );
  });

  afterEach(() => {
    engine.dispose();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("does not play SFX when sfx is disabled", () => {
    settings.sfx = false;

    const sourcesBefore = mockWebAudio.sources.length;

    engine.play("click");

    expect(mockWebAudio.sources.length).toBe(sourcesBefore);
  });

  it("applies composite volume from registry, settings, and override", () => {
    engine.play("click", { volume: 0.5 });

    const playGain = mockWebAudio.gains.find(
      (gain) => gain.gain.value === 0.5 * 0.8 * 0.5
    );

    expect(playGain).toBeDefined();
    expect(
      mockWebAudio.sources[mockWebAudio.sources.length - 1]?.start
    ).toHaveBeenCalled();
  });

  it("throttles rapid coin plays", () => {
    engine.play("coin");
    engine.play("coin");

    expect(mockWebAudio.sources).toHaveLength(1);

    vi.advanceTimersByTime(120);

    engine.play("coin");

    expect(mockWebAudio.sources.length).toBeGreaterThanOrEqual(2);
  });

  it("does not start music when music is disabled", () => {
    settings.music = false;
    engine.unlock();
    engine.playMusic();

    const musicSource = mockWebAudio.sources.find((source) => source.loop);

    expect(musicSource).toBeUndefined();
  });

  it("starts music after unlock when music is enabled", () => {
    engine.unlock();
    engine.playMusic();

    const musicSource = mockWebAudio.sources.find((source) => source.loop);

    expect(musicSource?.loop).toBe(true);
    expect(musicSource?.start).toHaveBeenCalled();

    const musicGain = mockWebAudio.gains.find(
      (gain) => gain.gain.value === 0.4 * 0.8
    );

    expect(musicGain).toBeDefined();
  });

  it("loops hold SFX while playing and stops on release", () => {
    engine.play("hold");

    const holdSource = mockWebAudio.sources[mockWebAudio.sources.length - 1];

    expect(holdSource?.loop).toBe(true);
    expect(holdSource?.start).toHaveBeenCalled();

    engine.stop("hold");

    expect(holdSource?.stop).toHaveBeenCalled();
  });

  it("clears media session on unlock", () => {
    const metadataDescriptor = {
      configurable: true,
      value: { title: "Idleval" },
      writable: true,
    };

    Object.defineProperty(navigator, "mediaSession", {
      configurable: true,
      value: {
        metadata: metadataDescriptor.value,
        playbackState: "playing",
      },
    });

    engine.unlock();

    expect(navigator.mediaSession.metadata).toBeNull();
    expect(navigator.mediaSession.playbackState).toBe("none");
  });
});
