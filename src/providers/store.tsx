import { createStore, Provider as JotaiProvider } from "jotai";

export const store = createStore();

export const StoreProvider = ({ children }: React.PropsWithChildren) => (
  <JotaiProvider store={store}>{children}</JotaiProvider>
);
