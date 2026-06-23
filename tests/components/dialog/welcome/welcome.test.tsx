import { beforeEach, describe, expect, test } from "vitest";
import { AboutDialog } from "@/components/dialog/about/about";
import { WelcomeDialog } from "@/components/dialog/welcome/welcome";
import { LOCAL_STORAGE } from "@/config/local-storage";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";
import { resetGame } from "@/store/reset";
import { removeLocalStorage } from "@/test/component-helpers";
import { renderWithProviders } from "@/test/render-with-providers";

describe("WelcomeDialog", () => {
  beforeEach(() => {
    resetGame();
    removeLocalStorage(LOCAL_STORAGE.welcomeDialogSeen);
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

    expect(localStorage.getItem(LOCAL_STORAGE.welcomeDialogSeen)).toBe("true");
  });

  test("does not persist seen state when a lower-priority dialog is blocked", async () => {
    const screen = await renderWithProviders(
      <>
        <button onClick={() => toggleDialog(DIALOG_IDS.about)} type="button">
          Open about
        </button>
        <WelcomeDialog />
        <AboutDialog />
      </>
    );

    await expect
      .element(screen.getByRole("heading", { name: m["ui.welcome.title"]() }))
      .toBeInTheDocument();

    await screen.getByRole("button", { name: "Open about" }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.welcome.title"]() }))
      .toBeInTheDocument();
    expect(localStorage.getItem(LOCAL_STORAGE.welcomeDialogSeen)).not.toBe(
      "true"
    );
  });
});
