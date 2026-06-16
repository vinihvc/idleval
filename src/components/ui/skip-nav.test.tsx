import { describe, expect, test } from "vitest";
import { SkipNavContent, SkipNavLink } from "@/components/ui/skip-nav";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

describe("SkipNav", () => {
  test("renders skip link targeting main content", async () => {
    const screen = await renderWithProviders(
      <SkipNavLink>{m["ui.a11y.skipToContent"]()}</SkipNavLink>
    );

    const link = screen.getByRole("link", {
      name: m["ui.a11y.skipToContent"](),
    });

    await expect.element(link).toHaveAttribute("href", "#main-content");
    await expect
      .element(link)
      .toHaveAttribute("data-slot", "skip-nav-link");
  });

  test("renders main content landmark with focus target attributes", async () => {
    await renderWithProviders(
      <SkipNavContent>
        <p>Factory grid</p>
      </SkipNavContent>
    );

    const content = document.querySelector('[data-slot="skip-nav-content"]');

    expect(content).not.toBeNull();
    expect(content?.id).toBe("main-content");
    expect(content?.getAttribute("tabindex")).toBe("-1");
  });
});
