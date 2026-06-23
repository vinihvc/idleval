import { describe, expect, test } from "vitest";
import { borderedText } from "@/components/ui/text-border";
import { renderWithProviders } from "@/test/render-with-providers";

describe("borderedText", () => {
  test("applies variant classes", async () => {
    const screen = await renderWithProviders(
      <span className={borderedText({ variant: "blue", size: "md" })}>
        Styled
      </span>
    );

    await expect.element(screen.getByText("Styled")).toBeInTheDocument();
  });
});
