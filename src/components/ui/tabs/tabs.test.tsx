import { afterEach, describe, expect, test, vi } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sound as soundFunction } from "@/providers/sound";
import { renderWithProviders } from "@/test/render-with-providers";

describe("Tabs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  test("plays click sound when a tab is selected", async () => {
    const play = vi
      .spyOn(soundFunction, "play")
      .mockImplementation(() => undefined);
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

    await screen.getByRole("tab", { name: "Tab B" }).click();

    expect(play).toHaveBeenCalledWith("click");
  });
});
