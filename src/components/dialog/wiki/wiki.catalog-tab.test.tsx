import { describe, expect, test } from "vitest";
import {
  type WikiCatalogItem,
  WikiCatalogTab,
} from "@/components/dialog/wiki/wiki.catalog-tab";
import { m } from "@/i18n/messages";
import { renderWithProviders } from "@/test/render-with-providers";

const mockItems: WikiCatalogItem[] = [
  {
    id: "entry-open",
    title: "Open Entry",
    image: "/images/gods/huangdi.webp",
    icon: "/images/gods/icons/huangdi.webp",
    flavor: "A blessed entry",
    lore: "Lore text",
    mechanics: "Mechanics text",
  },
  {
    id: "entry-locked",
    title: "Locked Entry",
    image: "/images/gods/dagda.webp",
    icon: "/images/gods/icons/dagda.webp",
    flavor: "Hidden entry",
    lore: "Hidden lore",
    mechanics: "Hidden mechanics",
  },
];

describe("WikiCatalogTab", () => {
  test("renders all catalog cards", async () => {
    const screen = await renderWithProviders(
      <WikiCatalogTab items={mockItems} />
    );

    await expect
      .element(screen.getByRole("button", { name: "Open Entry" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "Locked Entry" }))
      .toBeInTheDocument();
  });

  test("opens detail view for any entry and returns to grid", async () => {
    const screen = await renderWithProviders(
      <WikiCatalogTab items={mockItems} />
    );

    await screen.getByRole("button", { name: "Locked Entry" }).click();

    await expect.element(screen.getByText("Locked Entry")).toBeInTheDocument();
    await expect.element(screen.getByText("Hidden lore")).toBeInTheDocument();

    await screen.getByRole("button", { name: m["ui.wiki.back"]() }).click();

    await expect
      .element(screen.getByRole("button", { name: "Locked Entry" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("Hidden lore"))
      .not.toBeInTheDocument();
  });
});
