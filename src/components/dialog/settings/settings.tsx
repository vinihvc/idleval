import type React from "react";
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
import { Separator } from "@/components/ui/separator";
import { m } from "@/i18n/messages";
import { useSound } from "@/providers/sound";
import { SettingsAudio } from "./settings.audio";
import { SettingsLanguage } from "./settings.language";
import { SettingsWiki } from "./settings.wiki";
import { SettingsReset } from "./settings-reset";

export const SettingsDialog = (
  props: React.ComponentProps<typeof ResponsiveDialog>
) => {
  const { children, ...rest } = props;

  const { musicVolume, setMusicVolume, setSfxVolume, sfxVolume } = useSound();

  return (
    <ResponsiveDialog {...rest}>
      {children}

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

          <SettingsWiki />

          <Separator />

          <SettingsReset />
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default SettingsDialog;
