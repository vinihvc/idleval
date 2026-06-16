import React from "react";
import { describe, expect, test } from "vitest";
import {
  type WikiCatalogItem,
  WikiCatalogTab,
} from "@/components/dialog/wiki/wiki.catalog-tab";
import { WikiCatalogSelectionProvider } from "@/components/dialog/wiki/wiki.catalog-selection";
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

const ControlledWikiCatalogTab = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  return (
    <>
      <button
        onClick={() => {
          if (selectedId) {
            setSelectedId(null);
          }
        }}
        type="button"
      >
        {m["ui.wiki.tab.gods"]()}
      </button>
      <WikiCatalogSelectionProvider
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      >
        <WikiCatalogTab items={mockItems} />
      </WikiCatalogSelectionProvider>
    </>
  );
};

describe("WikiCatalogTab", () => {
  test("renders all catalog cards", async () => {
    const screen = await renderWithProviders(
      <WikiCatalogSelectionProvider
        selectedId={null}
        setSelectedId={() => undefined}
      >
        <WikiCatalogTab items={mockItems} />
      </WikiCatalogSelectionProvider>
    );

    await expect
      .element(screen.getByRole("button", { name: "Open Entry" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "Locked Entry" }))
      .toBeInTheDocument();
  });

  test("opens detail view and returns to grid when active tab is clicked again", async () => {
    const screen = await renderWithProviders(<ControlledWikiCatalogTab />);

    await screen.getByRole("button", { name: "Locked Entry" }).click();

    await expect.element(screen.getByText("Locked Entry")).toBeInTheDocument();
    await expect.element(screen.getByText("Hidden lore")).toBeInTheDocument();

    await screen.getByRole("button", { name: m["ui.wiki.tab.gods"]() }).click();

    await expect
      .element(screen.getByRole("button", { name: "Locked Entry" }))
      .toBeInTheDocument();
    await expect
      .element(screen.getByText("Hidden lore"))
      .not.toBeInTheDocument();
  });
});
