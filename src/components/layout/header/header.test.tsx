import { describe, expect, test } from "vitest";
import { Header } from "@/components/layout/header/header";
import { m } from "@/i18n/messages";
import { seedGold } from "@/store/test-utils";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Header", () => {
  test("renders gold amount and navigation", async () => {
    seedGold(500);

    const screen = await renderWithProviders(<Header />);

    await expect.element(screen.getByText("$500")).toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.nav.upgrades"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.settings.open"]() }))
      .toBeInTheDocument();
  });
});
