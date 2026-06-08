import { describe, expect, test } from "vitest";
import { renderWithProviders } from "@/test/render-with-providers";
import { WaxSeal } from "./wax-seal";

describe("WaxSeal", () => {
  test("renders svg", async () => {
    const screen = await renderWithProviders(
      <div data-testid="seal-icon">
        <WaxSeal />
      </div>
    );

    expect(
      screen.getByTestId("seal-icon").element().querySelector("svg")
    ).not.toBeNull();
  });
});
