import { Menu } from "pixelarticons/react/Menu";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { useSound } from "@/providers/sound";
import { SettingsAudio } from "./settings.audio";
import { SettingsLanguage } from "./settings.language";
import { SettingsReset } from "./settings-reset";

export const SettingsDialog = () => {
  const { musicVolume, setMusicVolume, setSfxVolume, sfxVolume } = useSound();

  const [open, setOpen] = React.useState(false);

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button size="icon-md" variant="cream">
              <span className="sr-only">{m["ui.settings.open"]()}</span>
              <Menu />
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>{m["ui.settings.title"]()}</TooltipContent>
      </Tooltip>

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.settings.title"]()}
            src="/images/msc/setting.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.settings.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            {m["ui.settings.subtitle"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="grid min-w-0 gap-4 overflow-x-hidden">
          <SettingsLanguage />

          <Separator />

          <SettingsAudio
            musicVolume={musicVolume}
            onMusicVolumeChange={setMusicVolume}
            onSfxVolumeChange={setSfxVolume}
            sfxVolume={sfxVolume}
          />

          <Separator />

          <SettingsReset onResetComplete={() => setOpen(false)} />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
