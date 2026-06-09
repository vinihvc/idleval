import { beforeEach, describe, expect, test } from "vitest";
import { WelcomeDialog } from "@/components/dialog/welcome";
import { LOCAL_STORAGE_KEYS } from "@/config/local-storage-keys";
import { m } from "@/i18n/messages";
import { removeLocalStorage } from "@/test/component-helpers";
import { renderWithProviders } from "@/test/render-with-providers";

describe("WelcomeDialog", () => {
  beforeEach(() => {
    removeLocalStorage(LOCAL_STORAGE_KEYS.welcomeDialogSeen);
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

    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.welcomeDialogSeen)).toBe(
      "true"
    );
  });
});
