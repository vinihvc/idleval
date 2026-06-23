import { beforeEach, describe, expect, test } from "vitest";
import { Footer } from "@/components/layout/footer";
import { m } from "@/i18n/messages";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Footer", () => {
  beforeEach(() => {
    resetGame();
  });

  test("renders about link and attribution", async () => {
    const screen = await renderWithProviders(<Footer />);

    await expect
      .element(screen.getByRole("button", { name: m["ui.nav.about"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("© Vinicius Vicentini"))
      .toBeInTheDocument();
  });

  test("opens about dialog", async () => {
    const screen = await renderWithProviders(<Footer />);

    await screen.getByRole("button", { name: m["ui.nav.about"]() }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.about.title"]() }))
      .toBeInTheDocument();
  });
});
