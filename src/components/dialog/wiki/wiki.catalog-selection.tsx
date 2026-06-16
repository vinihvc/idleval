import React from "react";

interface WikiCatalogSelectionContextValue {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const WikiCatalogSelectionContext =
  React.createContext<WikiCatalogSelectionContextValue | null>(null);

interface WikiCatalogSelectionProviderProps extends React.PropsWithChildren {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const WikiCatalogSelectionProvider = (
  props: WikiCatalogSelectionProviderProps
) => {
  const { selectedId, setSelectedId, children } = props;

  const value = React.useMemo(
    () => ({ selectedId, setSelectedId }),
    [selectedId, setSelectedId]
  );

  return (
    <WikiCatalogSelectionContext.Provider value={value}>
      {children}
    </WikiCatalogSelectionContext.Provider>
  );
};

export const useWikiCatalogSelection = () => {
  const context = React.use(WikiCatalogSelectionContext);

  if (!context) {
    throw new Error(
      "useWikiCatalogSelection must be used within WikiCatalogSelectionProvider"
    );
  }

  return context;
};
