import { describe, expect, test } from "vitest";
import { NumberText } from "@/components/ui/number-text";
import { renderWithProviders } from "@/test/render-with-providers";

describe("NumberText", () => {
  test("renders numeric text", async () => {
    const screen = await renderWithProviders(
      <NumberText variant="green">999</NumberText>
    );

    await expect.element(screen.getByText("999")).toBeInTheDocument();
  });
});
