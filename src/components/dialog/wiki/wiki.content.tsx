import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { m } from "@/i18n/messages";
import { WikiFiguresTab } from "./wiki.figures-tab";
import { WikiGodsTab } from "./wiki.gods-tab";
import { WikiUpgradesTab } from "./wiki.upgrades-tab";

export const WikiContent = () => (
  <Tabs defaultValue="gods">
    <TabsList>
      <TabsTrigger value="gods">{m["ui.wiki.tab.gods"]()}</TabsTrigger>
      <TabsTrigger value="figures">{m["ui.wiki.tab.figures"]()}</TabsTrigger>
      <TabsTrigger value="upgrades">{m["ui.wiki.tab.upgrades"]()}</TabsTrigger>
    </TabsList>

    <TabsContent className="mt-2" value="gods">
      <WikiGodsTab />
    </TabsContent>

    <TabsContent className="mt-2" value="figures">
      <WikiFiguresTab />
    </TabsContent>

    <TabsContent className="mt-2" value="upgrades">
      <WikiUpgradesTab />
    </TabsContent>
  </Tabs>
);
