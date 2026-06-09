import { describe, expect, test } from "vitest";
import { HeaderNavigation } from "@/components/layout/header/header.navigation";
import { Navigation } from "@/components/layout/navigation";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Navigation", () => {
  test("renders mobile nav items", async () => {
    const screen = await renderWithProviders(<Navigation />);

    await expect
      .element(screen.getByRole("button", { name: m["ui.nav.upgrades"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.nav.managers"]() }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: m["ui.nav.gods"]() }))
      .toBeInTheDocument();
  });

  test("renders translated labels for the selected locale", async () => {
    const screen = await renderWithProviders(<HeaderNavigation />, {
      locale: "es",
    });

    await expect
      .element(screen.getByRole("button", { name: "Dioses" }))
      .toBeInTheDocument();
  });

  test("opens upgrades dialog from nav", async () => {
    const screen = await renderWithProviders(<Navigation />);

    await screen.getByRole("button", { name: m["ui.nav.upgrades"]() }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.upgrades.title"]() }))
      .toBeInTheDocument();
  });
});

describe("HeaderNavigation", () => {
  test("opens dialog on trigger click", async () => {
    const screen = await renderWithProviders(<HeaderNavigation />);

    await screen.getByRole("button", { name: m["ui.nav.gods"]() }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.gods.title"]() }))
      .toBeInTheDocument();
  });
});
