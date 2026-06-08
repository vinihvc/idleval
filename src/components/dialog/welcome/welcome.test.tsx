import { beforeEach, describe, expect, test } from "vitest";
import { WelcomeDialog } from "@/components/dialog/welcome";
import { m } from "@/i18n/messages";
import { removeLocalStorage } from "@/test/component-helpers";
import { renderWithProviders } from "@/test/render-with-providers";

const WELCOME_DIALOG_STORAGE_KEY = "idleval:welcome-dialog-seen:v1";

describe("WelcomeDialog", () => {
  beforeEach(() => {
    removeLocalStorage(WELCOME_DIALOG_STORAGE_KEY);
  });

  test("opens when welcome has not been seen", async () => {
    const screen = await renderWithProviders(<WelcomeDialog />);

    await expect
      .element(screen.getByRole("heading", { name: m["ui.welcome.title"]() }))
      .toBeInTheDocument();
  });

  test("closes and persists seen state", async () => {
    const screen = await renderWithProviders(<WelcomeDialog />);

    await screen.getByRole("button", { name: m["ui.welcome.begin"]() }).click();

    expect(localStorage.getItem(WELCOME_DIALOG_STORAGE_KEY)).toBe("true");
  });
});
