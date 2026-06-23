import { describe, expect, test } from "vitest";
import { FormattedNumber } from "@/components/ui/formatted-number";
import { renderWithProviders } from "@/test/render-with-providers";

describe("FormattedNumber", () => {
  test("formats plain number", async () => {
    const screen = await renderWithProviders(<FormattedNumber value={1500} />);

    await expect.element(screen.getByText("1.5 K")).toBeInTheDocument();
  });

  test("formats with dollar sign", async () => {
    const screen = await renderWithProviders(
      <FormattedNumber isDollar value={100} />
    );

    await expect.element(screen.getByText("$100")).toBeInTheDocument();
  });
});
