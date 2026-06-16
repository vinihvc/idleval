import React from "react";
import { Tabs } from "@/components/ui/tabs";

export type WikiTabId = "gods" | "figures" | "upgrades" | "relics";

type WikiSelections = Record<WikiTabId, string | null>;

const initialSelections = (): WikiSelections => ({
  gods: null,
  figures: null,
  upgrades: null,
  relics: null,
});

interface WikiStateContextValue {
  activeTab: WikiTabId;
  onTabTriggerClick: (tabId: WikiTabId) => void;
  selections: WikiSelections;
  setSelection: (tabId: WikiTabId, selectedId: string | null) => void;
}

const WikiStateContext = React.createContext<WikiStateContextValue | null>(
  null
);

interface WikiStateProviderProps extends React.PropsWithChildren {}

export const WikiStateProvider = (props: WikiStateProviderProps) => {
  const { children } = props;

  const [activeTab, setActiveTab] = React.useState<WikiTabId>("gods");
  const [selections, setSelections] =
    React.useState<WikiSelections>(initialSelections);

  const handleTabTriggerClick = React.useCallback(
    (tabId: WikiTabId) => {
      if (tabId === activeTab && selections[tabId]) {
        setSelections((current) => ({ ...current, [tabId]: null }));
      }
    },
    [activeTab, selections]
  );

  const setSelection = React.useCallback(
    (tabId: WikiTabId, selectedId: string | null) => {
      setSelections((current) => ({ ...current, [tabId]: selectedId }));
    },
    []
  );

  const value = React.useMemo(
    () => ({
      activeTab,
      onTabTriggerClick: handleTabTriggerClick,
      selections,
      setSelection,
    }),
    [activeTab, handleTabTriggerClick, selections, setSelection]
  );

  return (
    <WikiStateContext.Provider value={value}>
      <Tabs
        onValueChange={(details) => {
          setActiveTab(details.value as WikiTabId);
        }}
        value={activeTab}
      >
        {children}
      </Tabs>
    </WikiStateContext.Provider>
  );
};

export const useWikiState = () => {
  const context = React.use(WikiStateContext);

  if (!context) {
    throw new Error("useWikiState must be used within WikiStateProvider");
  }

  return context;
};
