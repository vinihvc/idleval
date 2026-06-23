import { afterEach, describe, expect, test, vi } from "vitest";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationList,
  BottomNavigationListItem,
} from "@/components/ui/bottom-navigation";
import { sound as soundFunction } from "@/providers/sound";
import { renderWithProviders } from "@/test/render-with-providers";

describe("BottomNavigation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders navigation items", async () => {
    const screen = await renderWithProviders(
      <BottomNavigation>
        <BottomNavigationList aria-label="Main">
          <BottomNavigationListItem>
            <BottomNavigationItem aria-label="Home">Home</BottomNavigationItem>
          </BottomNavigationListItem>
          <BottomNavigationListItem>
            <BottomNavigationItem aria-label="Shop">Shop</BottomNavigationItem>
          </BottomNavigationListItem>
        </BottomNavigationList>
      </BottomNavigation>
    );

    await expect
      .element(screen.getByRole("button", { name: "Home" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "Shop" }))
      .toBeInTheDocument();
  });

  test("plays configured sound and calls onClick handler", async () => {
    const onClick = vi.fn();
    const play = vi
      .spyOn(soundFunction, "play")
      .mockImplementation(() => undefined);
    const screen = await renderWithProviders(
      <BottomNavigationItem
        aria-label="Inventory"
        onClick={onClick}
        sound="coin"
      >
        Inventory
      </BottomNavigationItem>
    );

    await screen.getByRole("button", { name: "Inventory" }).click();

    expect(play).toHaveBeenCalledWith("coin");
    expect(onClick).toHaveBeenCalledOnce();
  });
});
