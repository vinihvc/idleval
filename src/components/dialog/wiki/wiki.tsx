import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { m } from "@/i18n/messages";
import { WikiFiguresTab } from "./wiki.figures-tab";
import { WikiGodsTab } from "./wiki.gods-tab";
import { WikiUpgradesTab } from "./wiki.upgrades-tab";

export const WikiDialog = (
  props: React.ComponentProps<typeof ResponsiveDialog>
) => {
  const { children, ...rest } = props;

  return (
    <ResponsiveDialog {...rest}>
      {children}
      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.wiki.title"]()}
            src="/images/msc/wiki.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{m["ui.wiki.title"]()}</ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription>
            {m["ui.wiki.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="text-popover-foreground">
          <Tabs defaultValue="gods">
            <TabsList>
              <TabsTrigger value="gods">{m["ui.wiki.tab.gods"]()}</TabsTrigger>
              <TabsTrigger value="figures">
                {m["ui.wiki.tab.figures"]()}
              </TabsTrigger>
              <TabsTrigger value="upgrades">
                {m["ui.wiki.tab.upgrades"]()}
              </TabsTrigger>
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
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default WikiDialog;
