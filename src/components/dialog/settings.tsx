import { Menu } from "pixelarticons/react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleMusic, toggleSfx, useSettings } from "@/store/atoms/settings";

export const SettingDialog = () => {
  const settings = useSettings();

  return (
    <ResponsiveDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button size="icon-md" variant="white">
              <span className="sr-only">Open Settings</span>
              <Menu />
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Settings</TooltipContent>
      </Tooltip>

      <ResponsiveDialogContent>
        <ResponsiveDialogImage alt="Settings" src="/images/msc/setting.webp" />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Settings</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Tune courtly comforts to your liking.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-4">
            <div className="border-primary/25 flex items-center justify-between gap-3 rounded-md border bg-popover-foreground/6 px-3 py-3 text-popover-foreground text-sm">
              <label className="font-semibold" htmlFor="toggle-music">
                Music
              </label>

              <Switch
                checked={settings.music}
                id="toggle-music"
                onCheckedChange={toggleMusic}
              />
            </div>

            <div className="border-primary/25 flex items-center justify-between gap-3 rounded-md border bg-popover-foreground/6 px-3 py-3 text-popover-foreground text-sm">
              <label className="font-semibold" htmlFor="toggle-sfx">
                SFX
              </label>

              <Switch
                checked={settings.sfx}
                id="toggle-sfx"
                onCheckedChange={toggleSfx}
              />
            </div>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
