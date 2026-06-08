import { describe, expect, test } from "vitest";
import { FactoryDialog } from "@/components/dialog/factory";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { renderWithProviders } from "@/test/render-with-providers";

describe("FactoryDialog", () => {
  test("shows factory details when opened", async () => {
    const screen = await renderWithProviders(
      <FactoryDialog factoryType="grain">
        <ResponsiveDialogTrigger asChild>
          <Button sound={false}>Open grain</Button>
        </ResponsiveDialogTrigger>
      </FactoryDialog>
    );

    await screen.getByRole("button", { name: "Open grain" }).click();

    await expect
      .element(screen.getByRole("heading", { name: "Grain" }))
      .toBeInTheDocument();
  });
});
