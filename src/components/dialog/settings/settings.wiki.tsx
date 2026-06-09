import { BookOpen } from "pixelarticons/react/BookOpen";
import { WikiDialog } from "@/components/dialog/wiki";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";

export const SettingsWiki = () => (
  <WikiDialog>
    <ResponsiveDialogTrigger asChild>
      <Button className="w-full justify-center gap-2" size="lg" variant="brown">
        <BookOpen />
        {m["ui.wiki.open"]()}
      </Button>
    </ResponsiveDialogTrigger>
  </WikiDialog>
);
