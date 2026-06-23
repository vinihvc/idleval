import { describe, expect, test } from "vitest";
import { Background } from "@/components/layout/background";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Background", () => {
  test("renders background image", async () => {
    const screen = await renderWithProviders(
      <div data-testid="background">
        <Background />
      </div>
    );

    expect(
      screen.getByTestId("background").element().querySelector("img")
    ).not.toBeNull();
  });
});
