import { describe, expect, test } from "vitest";
import { renderWithProviders } from "@/test/render-with-providers";
import { Logo } from "./logo";

describe("Logo", () => {
  test("renders svg", async () => {
    const screen = await renderWithProviders(
      <div data-testid="logo-icon">
        <Logo />
      </div>
    );

    expect(
      screen.getByTestId("logo-icon").element().querySelector("svg")
    ).not.toBeNull();
  });
});
