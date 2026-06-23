import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { SettingsInstall } from "@/components/dialog/settings/settings.install";
import { resetInstallPromptForTests } from "@/hooks/use-install-prompt";
import { m } from "@/i18n/messages";

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
  outcome: TestInstallPromptOutcome = "dismissed"
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

describe("SettingsInstall", () => {
  beforeEach(() => {
    resetInstallPromptForTests();
  });

  afterEach(() => {
    resetInstallPromptForTests();
    vi.unstubAllGlobals();
  });

  test("hides the install section before a prompt or iOS context", async () => {
    const screen = await render(<SettingsInstall />);

    await expect
      .element(screen.getByRole("button", { name: m["ui.install.install"]() }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.install.title"]()))
      .not.toBeInTheDocument();
  });

  test("shows title, description, and install button when prompt is available", async () => {
    const screen = await render(<SettingsInstall />);
    const { event, prompt } = createBeforeInstallPromptEvent();

    window.dispatchEvent(event);

    await expect
      .element(screen.getByRole("heading", { name: m["ui.install.title"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.install.description"]()))
      .toBeInTheDocument();

    const installButton = screen.getByRole("button", {
      name: m["ui.install.install"](),
    });

    await expect.element(installButton).toBeEnabled();
    await installButton.click();

    expect(prompt).toHaveBeenCalledTimes(1);
  });

  test("shows installed state with description after acceptance", async () => {
    const screen = await render(<SettingsInstall />);
    const { event } = createBeforeInstallPromptEvent("accepted");

    window.dispatchEvent(event);

    const installButton = screen.getByRole("button", {
      name: m["ui.install.install"](),
    });
    await installButton.click();

    await expect
      .element(
        screen.getByRole("button", { name: m["ui.install.installed"]() })
      )
      .toBeDisabled();
    await expect
      .element(screen.getByText(m["ui.install.installedDescription"]()))
      .toBeInTheDocument();
  });

  test("shows iOS instructions without an install button", async () => {
    vi.stubGlobal("navigator", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      maxTouchPoints: 5,
      standalone: undefined,
    });

    const screen = await render(<SettingsInstall />);

    await expect
      .element(screen.getByRole("heading", { name: m["ui.install.title"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.install.iosInstructions"]()))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.install.install"]() }))
      .not.toBeInTheDocument();
  });
});
