import { Separator } from "@/components/ui/separator";
import { SettingsAudio } from "./settings.audio";
import { SettingsInstall } from "./settings.install";
import { SettingsLanguage } from "./settings.language";
import { SettingsReset } from "./settings-reset";

export const SettingsContent = () => (
  <>
    <SettingsLanguage />

    <Separator />

    <SettingsAudio />

    <SettingsInstall />

    <Separator />

    <SettingsReset />
  </>
);
