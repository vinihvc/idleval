import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { m } from "@/i18n/messages";
import { useWikiState } from "./wiki.state";

export const WikiTabs = () => {
  const { onTabTriggerClick } = useWikiState();

  return (
    <TabsList className="px-(--space) py-[calc(var(--space)/3)]">
      <TabsTrigger
        onClick={() => {
          onTabTriggerClick("gods");
        }}
        value="gods"
      >
        {m["ui.wiki.tab.gods"]()}
      </TabsTrigger>
      <TabsTrigger
        onClick={() => {
          onTabTriggerClick("figures");
        }}
        value="figures"
      >
        {m["ui.wiki.tab.figures"]()}
      </TabsTrigger>
      <TabsTrigger
        onClick={() => {
          onTabTriggerClick("upgrades");
        }}
        value="upgrades"
      >
        {m["ui.wiki.tab.upgrades"]()}
      </TabsTrigger>
      <TabsTrigger
        onClick={() => {
          onTabTriggerClick("relics");
        }}
        value="relics"
      >
        {m["ui.wiki.tab.relics"]()}
      </TabsTrigger>
    </TabsList>
  );
};
