import { beforeEach, describe, expect, test } from "vitest";
import { GameSectionDialogs } from "@/components/layout/game-section-dialogs";
import { HeaderNavigation } from "@/components/layout/header/header.navigation";
import { Navigation } from "@/components/layout/navigation";
import { m } from "@/i18n/messages";
import { resetGame } from "@/store/reset";
import { renderWithProviders } from "@/test/render-with-providers";

beforeEach(() => {
  resetGame();
});

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
    const screen = await renderWithProviders(
      <>
        <Navigation />
        <GameSectionDialogs />
      </>
    );

    await screen.getByRole("button", { name: m["ui.nav.upgrades"]() }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.upgrades.title"]() }))
      .toBeInTheDocument();
    expect(screen.getByRole("dialog").elements()).toHaveLength(1);
  });

  test("opening another nav dialog closes the previous dialog", async () => {
    const screen = await renderWithProviders(
      <>
        <Navigation />
        <GameSectionDialogs />
      </>
    );

    await screen.getByRole("button", { name: m["ui.nav.upgrades"]() }).click();
    await expect
      .element(screen.getByRole("heading", { name: m["ui.upgrades.title"]() }))
      .toBeInTheDocument();

    await screen.getByRole("button", { name: m["ui.nav.managers"]() }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.managers.title"]() }))
      .toBeInTheDocument();
    await expect
      .poll(
        () =>
          screen
            .getByRole("heading", { name: m["ui.upgrades.title"]() })
            .elements().length
      )
      .toBe(0);
  });
});

describe("HeaderNavigation", () => {
  test("opens dialog on trigger click", async () => {
    const screen = await renderWithProviders(
      <>
        <HeaderNavigation />
        <GameSectionDialogs />
      </>
    );

    await screen.getByRole("button", { name: m["ui.nav.gods"]() }).click();

    await expect
      .element(screen.getByRole("heading", { name: m["ui.gods.title"]() }))
      .toBeInTheDocument();
    expect(screen.getByRole("dialog").elements()).toHaveLength(1);
  });
});
