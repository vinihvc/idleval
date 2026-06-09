import { describe, expect, test } from "vitest";
import {
  BottomNavigation,
  BottomNavigationItem,
  BottomNavigationList,
  BottomNavigationListItem,
} from "@/components/ui/bottom-navigation";
import { renderWithProviders } from "@/test/render-with-providers";

describe("BottomNavigation", () => {
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
});
