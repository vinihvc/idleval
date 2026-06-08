import { describe, expect, test } from "vitest";
import { HoldButton } from "@/components/ui/hold-button";
import { renderWithProviders } from "@/test/render-with-providers";

describe("HoldButton", () => {
  test("renders label", async () => {
    const screen = await renderWithProviders(
      <HoldButton>Hold to confirm</HoldButton>
    );

    await expect
      .element(screen.getByRole("button", { name: "Hold to confirm" }))
      .toBeInTheDocument();
  });
});
