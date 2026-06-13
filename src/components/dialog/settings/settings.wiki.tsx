import { BookOpen } from "pixelarticons/react/BookOpen";
import { Button } from "@/components/ui/button";
import { m } from "@/i18n/messages";
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";

export const SettingsWiki = () => (
  <Button
    className="w-full"
    onClick={() => toggleDialog(DIALOG_IDS.wiki)}
    size="lg"
    variant="brown"
  >
    <BookOpen />
    {m["ui.wiki.open"]()}
  </Button>
);
