import type { PropsWithChildren } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Switch } from "@/components/ui/switch";
import { toggleMusic, toggleSfx, useSettings } from "@/store/atoms/settings";

export const SettingDialog = (props: PropsWithChildren) => {
  const { children } = props;
  const settings = useSettings();

  return (
    <ResponsiveDialog>
      {children}

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
            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-3 text-popover-foreground text-sm">
              <label className="font-semibold" htmlFor="toggle-music">
                Music
              </label>

              <Switch
                checked={settings.music}
                id="toggle-music"
                onCheckedChange={toggleMusic}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-3 text-popover-foreground text-sm">
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
