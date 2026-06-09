import { describe, expect, test } from "vitest";
import { boxBorder } from "@/components/ui/box-border";
import { renderWithProviders } from "@/test/render-with-providers";

describe("boxBorder", () => {
  test("applies variant classes", async () => {
    const screen = await renderWithProviders(
      <div className={boxBorder({ variant: "brown", size: "md" })}>
        Raised
      </div>
    );

    await expect.element(screen.getByText("Raised")).toBeInTheDocument();
  });
});
