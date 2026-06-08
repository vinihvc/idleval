import { describe, expect, test } from "vitest";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationList,
} from "@/components/ui/bottom-navigation";
import { renderWithProviders } from "@/test/render-with-providers";

describe("BottomNavigation", () => {
  test("renders navigation items", async () => {
    const screen = await renderWithProviders(
      <BottomNavigation defaultValue="home">
        <BottomNavigationList aria-label="Main">
          <BottomNavigationItem aria-label="Home" value="home">
            Home
          </BottomNavigationItem>
          <BottomNavigationItem aria-label="Shop" value="shop">
            Shop
          </BottomNavigationItem>
        </BottomNavigationList>
      </BottomNavigation>
    );

    await expect
      .element(screen.getByRole("tab", { name: "Home" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("tab", { name: "Shop" }))
      .toBeInTheDocument();
  });
});
