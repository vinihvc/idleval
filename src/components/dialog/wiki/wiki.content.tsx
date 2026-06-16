import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { m } from "@/i18n/messages";
import { WikiCatalogSelectionProvider } from "./wiki.catalog-selection";
import { WikiFiguresTab } from "./wiki.figures-tab";
import { WikiGodsTab } from "./wiki.gods-tab";
import { WikiPowerUpsTab } from "./wiki.power-ups-tab";
import { WikiUpgradesTab } from "./wiki.upgrades-tab";

export type WikiTabId = "gods" | "figures" | "upgrades" | "relics";

type WikiSelections = Record<WikiTabId, string | null>;

const initialSelections = (): WikiSelections => ({
  gods: null,
  figures: null,
  upgrades: null,
  relics: null,
});

export const WikiContent = () => {
  const [activeTab, setActiveTab] = React.useState<WikiTabId>("gods");
  const [selections, setSelections] =
    React.useState<WikiSelections>(initialSelections);

  const handleTabTriggerClick = (tabId: WikiTabId) => {
    if (tabId === activeTab && selections[tabId]) {
      setSelections((current) => ({ ...current, [tabId]: null }));
    }
  };

  const setSelection = React.useCallback(
    (tabId: WikiTabId, selectedId: string | null) => {
      setSelections((current) => ({ ...current, [tabId]: selectedId }));
    },
    []
  );

  return (
    <Tabs
      onValueChange={(details) => {
        setActiveTab(details.value as WikiTabId);
      }}
      value={activeTab}
    >
      <TabsList>
        <TabsTrigger
          onClick={() => {
            handleTabTriggerClick("gods");
          }}
          value="gods"
        >
          {m["ui.wiki.tab.gods"]()}
        </TabsTrigger>
        <TabsTrigger
          onClick={() => {
            handleTabTriggerClick("figures");
          }}
          value="figures"
        >
          {m["ui.wiki.tab.figures"]()}
        </TabsTrigger>
        <TabsTrigger
          onClick={() => {
            handleTabTriggerClick("upgrades");
          }}
          value="upgrades"
        >
          {m["ui.wiki.tab.upgrades"]()}
        </TabsTrigger>
        <TabsTrigger
          onClick={() => {
            handleTabTriggerClick("relics");
          }}
          value="relics"
        >
          {m["ui.wiki.tab.relics"]()}
        </TabsTrigger>
      </TabsList>

      <TabsContent className="mt-2" value="gods">
        <WikiCatalogSelectionProvider
          selectedId={selections.gods}
          setSelectedId={(id) => {
            setSelection("gods", id);
          }}
        >
          <WikiGodsTab />
        </WikiCatalogSelectionProvider>
      </TabsContent>

      <TabsContent className="mt-2" value="figures">
        <WikiCatalogSelectionProvider
          selectedId={selections.figures}
          setSelectedId={(id) => {
            setSelection("figures", id);
          }}
        >
          <WikiFiguresTab />
        </WikiCatalogSelectionProvider>
      </TabsContent>

      <TabsContent className="mt-2" value="upgrades">
        <WikiCatalogSelectionProvider
          selectedId={selections.upgrades}
          setSelectedId={(id) => {
            setSelection("upgrades", id);
          }}
        >
          <WikiUpgradesTab />
        </WikiCatalogSelectionProvider>
      </TabsContent>

      <TabsContent className="mt-2" value="relics">
        <WikiCatalogSelectionProvider
          selectedId={selections.relics}
          setSelectedId={(id) => {
            setSelection("relics", id);
          }}
        >
          <WikiPowerUpsTab />
        </WikiCatalogSelectionProvider>
      </TabsContent>
    </Tabs>
  );
};
