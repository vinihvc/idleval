import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SoundEngine } from "./engine";

interface MockAudioInstance {
  currentTime: number;
  loop: boolean;
  pause: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  playbackRate: number;
  preload: string;
  src: string;
  volume: number;
}

const createMockAudio = () => {
  const instances: MockAudioInstance[] = [];

  const MockAudio = vi.fn((src?: string) => {
    const instance: MockAudioInstance = {
      src: src ?? "",
      volume: 1,
      playbackRate: 1,
      currentTime: 0,
      loop: false,
      preload: "",
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
    };

    instances.push(instance);

    return instance as unknown as HTMLAudioElement;
  });

  return { MockAudio, instances };
};

describe("SoundEngine", () => {
  let engine: SoundEngine;
  let settings: {
    music: boolean;
    musicVolume: number;
    sfx: boolean;
    sfxVolume: number;
  };
  let mockAudio: ReturnType<typeof createMockAudio>;

  beforeEach(() => {
    vi.useFakeTimers();

    engine = new SoundEngine();
    settings = {
      music: true,
      musicVolume: 0.8,
      sfx: true,
      sfxVolume: 0.8,
    };
    mockAudio = createMockAudio();

    engine.init(
      () => settings,
      (callback) => {
        callback();
        return () => undefined;
      },
      {
        createAudio: mockAudio.MockAudio as unknown as (
          src?: string
        ) => HTMLAudioElement,
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

    const playCallsBefore = mockAudio.instances.reduce(
      (total, instance) => total + instance.play.mock.calls.length,
      0
    );

    engine.play("click");

    const playCallsAfter = mockAudio.instances.reduce(
      (total, instance) => total + instance.play.mock.calls.length,
      0
    );

    expect(playCallsAfter).toBe(playCallsBefore);
  });

  it("applies composite volume from registry, settings, and override", () => {
    engine.play("click", { volume: 0.5 });

    const clickAudio = mockAudio.instances.find((instance) =>
      instance.src.includes("click.wav")
    );

    expect(clickAudio?.volume).toBeCloseTo(0.6 * 0.8 * 0.5);
  });

  it("throttles rapid coin plays", () => {
    engine.play("coin");
    engine.play("coin");

    const coinPlays = mockAudio.instances.filter((instance) =>
      instance.src.includes("coin.wav")
    );

    expect(
      coinPlays.filter((instance) => instance.play.mock.calls.length > 0)
    ).toHaveLength(1);

    vi.advanceTimersByTime(120);

    engine.play("coin");

    const playedCoinInstances = mockAudio.instances.filter(
      (instance) =>
        instance.src.includes("coin.wav") && instance.play.mock.calls.length > 0
    );

    expect(playedCoinInstances.length).toBeGreaterThanOrEqual(2);
  });

  it("does not start music when music is disabled", () => {
    settings.music = false;
    engine.unlock();
    engine.playMusic();

    const musicAudio = mockAudio.instances.find((instance) =>
      instance.src.includes("music.wav")
    );

    expect(musicAudio?.play).toBeUndefined();
  });

  it("starts music after unlock when music is enabled", () => {
    engine.unlock();
    engine.playMusic();

    const musicAudio = mockAudio.instances.find((instance) =>
      instance.src.includes("music.wav")
    );

    expect(musicAudio?.loop).toBe(true);
    expect(musicAudio?.play).toHaveBeenCalled();
    expect(musicAudio?.volume).toBeCloseTo(0.4 * 0.8);
  });
});
