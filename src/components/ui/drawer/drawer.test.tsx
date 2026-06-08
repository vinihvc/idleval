import { describe, expect, test } from "vitest";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Drawer", () => {
  test("opens drawer on trigger click", async () => {
    const screen = await renderWithProviders(
      <Drawer>
        <DrawerTrigger asChild>
          <Button sound={false}>Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>Drawer body</DrawerBody>
        </DrawerContent>
      </Drawer>
    );

    await screen.getByRole("button", { name: "Open drawer" }).click();

    await expect.element(screen.getByText("Drawer title")).toBeInTheDocument();
    await expect.element(screen.getByText("Drawer body")).toBeInTheDocument();
  });
});
