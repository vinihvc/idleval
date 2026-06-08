import { describe, expect, test } from "vitest";
import { Toggle, ToggleIndicator } from "@/components/ui/toggle";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Toggle", () => {
  test("renders toggle button", async () => {
    const screen = await renderWithProviders(
      <Toggle aria-label="Bold">
        <ToggleIndicator>B</ToggleIndicator>
      </Toggle>
    );

    await expect
      .element(screen.getByRole("button", { name: "Bold" }))
      .toBeInTheDocument();
  });
});
