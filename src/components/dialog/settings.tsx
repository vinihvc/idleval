import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Switch } from "@/components/ui/switch";
import { toggleMusic, toggleSfx, useSettings } from "@/store/atoms/settings";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const SettingDialog = () => {
  const settings = useSettings();

  return (
    <ResponsiveDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button size="icon" variant="white">
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
            Change the game settings to fit your preferences.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-5">
            <div className="flex items-center justify-between">
              <label className="font-semibold" htmlFor="toggle-music">
                Music
              </label>

              <Switch
                checked={settings.music}
                id="toggle-music"
                onCheckedChange={toggleMusic}
              />
            </div>

            <div className="flex items-center justify-between">
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

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="xl">Close Settings</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
