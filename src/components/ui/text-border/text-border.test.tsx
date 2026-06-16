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

  test("adds clip-safe padding when truncateSafe is true", () => {
    expect(borderedText({ size: "sm", truncateSafe: true })).toContain(
      "truncate"
    );
    expect(borderedText({ size: "sm", truncateSafe: true })).toContain(
      "p-0.5"
    );
    expect(borderedText({ size: "lg", truncateSafe: true })).toContain("p-1");
  });

  test("adds clip-safe padding when clipSafe is true", () => {
    expect(borderedText({ size: "lg", clipSafe: true })).toContain("p-1");
  });
});
