import { describe, expect, test } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Tabs", () => {
  test("renders codex-styled tab list by default", async () => {
    const screen = await renderWithProviders(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
      </Tabs>
    );

    await expect
      .element(screen.getByRole("tablist"))
      .toHaveAttribute("data-variant", "default");
  });

  test("renders tabs and switches panel", async () => {
    const screen = await renderWithProviders(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    );

    await expect.element(screen.getByText("Panel A")).toBeInTheDocument();

    await screen.getByRole("tab", { name: "Tab B" }).click();

    await expect.element(screen.getByText("Panel B")).toBeInTheDocument();
  });
});
