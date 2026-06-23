import { describe, expect, test } from "vitest";
import { FactoryDialog } from "@/components/dialog/factory/factory";
import { Button } from "@/components/ui/button";
import { getFactoryDialogId, toggleDialog } from "@/store/atoms/dialogs";
import { renderWithProviders } from "@/test/render-with-providers";

describe("FactoryDialog", () => {
  test("shows factory details when opened", async () => {
    const screen = await renderWithProviders(
      <>
        <Button
          onClick={() => toggleDialog(getFactoryDialogId("grain"))}
          sound={false}
        >
          Open grain
        </Button>
        <FactoryDialog factoryType="grain" />
      </>
    );

    await screen.getByRole("button", { name: "Open grain" }).click();

    await expect
      .element(screen.getByRole("heading", { name: "Grain" }))
      .toBeInTheDocument();
  });
});
