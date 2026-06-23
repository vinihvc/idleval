import { describe, expect, test } from "vitest";
import { Slider, SliderLabel } from "@/components/ui/slider";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Slider", () => {
  test("renders slider with default value", async () => {
    const screen = await renderWithProviders(
      <Slider aria-label={["Volume"]} defaultValue={[40]} max={100} min={0}>
        <SliderLabel>Volume</SliderLabel>
      </Slider>
    );

    const slider = screen.getByRole("slider", { name: "Volume" });
    await expect.element(slider).toBeInTheDocument();
  });
});
