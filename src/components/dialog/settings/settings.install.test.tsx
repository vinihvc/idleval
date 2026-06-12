import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { SettingsInstall } from "@/components/dialog/settings/settings.install";
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
  test("hides the install section before Chrome exposes a prompt", async () => {
    const screen = await render(<SettingsInstall />);

    await expect
      .element(screen.getByRole("button", { name: m["ui.install.install"]() }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByText(m["ui.install.title"]()))
      .not.toBeInTheDocument();
  });

  test("uses the captured browser install prompt when available", async () => {
    const screen = await render(<SettingsInstall />);
    const { event, prompt } = createBeforeInstallPromptEvent();

    window.dispatchEvent(event);

    const installButton = screen.getByRole("button", {
      name: m["ui.install.install"](),
    });

    await expect.element(installButton).toBeEnabled();

    await installButton.click();

    expect(prompt).toHaveBeenCalledTimes(1);
  });
});
