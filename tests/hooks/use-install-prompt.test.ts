import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  getInstallPromptStateForTests,
  initializeInstallPrompt,
  isIosDevice,
  isIosSafari,
  isStandaloneDisplay,
  resetInstallPromptForTests,
  runInstallPromptForTests,
} from "@/hooks/use-install-prompt";

type TestInstallPromptOutcome = "accepted" | "dismissed";

interface TestBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  readonly userChoice: Promise<{
    outcome: TestInstallPromptOutcome;
    platform: string;
  }>;
}

const createBeforeInstallPromptEvent = (
  outcome: TestInstallPromptOutcome = "accepted"
) => {
  const event = new Event("beforeinstallprompt", {
    cancelable: true,
  }) as TestBeforeInstallPromptEvent;
  const prompt = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);

  Object.defineProperties(event, {
    platforms: {
      value: ["web"],
    },
    prompt: {
      value: prompt,
    },
    userChoice: {
      value: Promise.resolve({
        outcome,
        platform: "web",
      }),
    },
  });

  return { event, prompt };
};

const stubNavigator = (userAgent: string, platform = "MacIntel") => {
  vi.stubGlobal("navigator", {
    userAgent,
    platform,
    maxTouchPoints: 0,
    standalone: undefined,
  });
};

const stubWindow = (options?: {
  standalone?: boolean;
  standaloneDisplay?: boolean;
}) => {
  const matchMedia = vi.fn((query: string) => ({
    matches:
      query === "(display-mode: standalone)" &&
      (options?.standaloneDisplay ?? false),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  vi.stubGlobal("window", {
    matchMedia,
    navigator: {
      ...(globalThis.navigator as Navigator),
      standalone: options?.standalone,
    },
    addEventListener: vi.fn((type, listener) => {
      if (type === "beforeinstallprompt" || type === "appinstalled") {
        (
          window as Window & {
            __installListeners?: Map<string, EventListener>;
          }
        ).__installListeners ??= new Map();
        (
          window as unknown as Window & {
            __installListeners: Map<string, EventListener>;
          }
        ).__installListeners.set(type, listener as EventListener);
      }
    }),
    dispatchEvent: vi.fn((event: Event) => {
      const listeners = (
        window as Window & {
          __installListeners?: Map<string, EventListener>;
        }
      ).__installListeners;
      listeners?.get(event.type)?.(event);
      return true;
    }),
  });
};

describe("install prompt helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("isIosDevice detects iPhone user agents", () => {
    stubNavigator(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
    );

    expect(isIosDevice()).toBe(true);
  });

  test("isIosSafari excludes Chrome on iOS", () => {
    stubNavigator(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) CriOS/120.0.0.0"
    );

    expect(isIosSafari()).toBe(false);
  });

  test("isIosSafari matches Safari on iOS", () => {
    stubNavigator(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1"
    );

    expect(isIosSafari()).toBe(true);
  });

  test("isStandaloneDisplay detects standalone display mode", () => {
    stubWindow({ standaloneDisplay: true });

    expect(isStandaloneDisplay()).toBe(true);
  });
});

describe("initializeInstallPrompt", () => {
  beforeEach(() => {
    resetInstallPromptForTests();
    stubNavigator("Mozilla/5.0");
    stubWindow();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    resetInstallPromptForTests();
  });

  test("marks installed when launched in standalone mode", () => {
    stubWindow({ standaloneDisplay: true });
    resetInstallPromptForTests();

    initializeInstallPrompt();

    expect(getInstallPromptStateForTests()).toMatchObject({
      canInstall: false,
      isInstalled: true,
      showIosInstructions: false,
    });
  });

  test("enables install when beforeinstallprompt fires", () => {
    initializeInstallPrompt();
    const { event } = createBeforeInstallPromptEvent();

    window.dispatchEvent(event);

    expect(getInstallPromptStateForTests()).toMatchObject({
      canInstall: true,
      isInstalled: false,
      showIosInstructions: false,
    });
  });

  test("marks installed when appinstalled fires", () => {
    initializeInstallPrompt();

    window.dispatchEvent(new Event("appinstalled"));

    expect(getInstallPromptStateForTests()).toMatchObject({
      canInstall: false,
      isInstalled: true,
      showIosInstructions: false,
    });
  });

  test("shows iOS instructions on Safari without a prompt", () => {
    vi.unstubAllGlobals();
    stubNavigator(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
      "iPhone"
    );
    stubWindow();
    resetInstallPromptForTests();

    initializeInstallPrompt();

    expect(getInstallPromptStateForTests()).toMatchObject({
      canInstall: false,
      isInstalled: false,
      showIosInstructions: true,
    });
  });
});

describe("useInstallPrompt install action", () => {
  beforeEach(() => {
    resetInstallPromptForTests();
    stubNavigator("Mozilla/5.0");
    stubWindow();
    initializeInstallPrompt();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    resetInstallPromptForTests();
  });

  test("accepted prompt marks the app as installed", async () => {
    const { event } = createBeforeInstallPromptEvent("accepted");
    window.dispatchEvent(event);

    const outcome = await runInstallPromptForTests();

    expect(outcome).toBe("accepted");
    expect(getInstallPromptStateForTests()).toMatchObject({
      canInstall: false,
      isInstalled: true,
    });
  });

  test("dismissed prompt hides install availability", async () => {
    const { event } = createBeforeInstallPromptEvent("dismissed");
    window.dispatchEvent(event);

    const outcome = await runInstallPromptForTests();

    expect(outcome).toBe("dismissed");
    expect(getInstallPromptStateForTests()).toMatchObject({
      canInstall: false,
      isInstalled: false,
      showIosInstructions: false,
    });
  });
});
