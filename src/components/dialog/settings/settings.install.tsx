import { Download } from "pixelarticons/react/Download";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { m } from "@/i18n/messages";

export const SettingsInstall = () => {
  const { canInstall, install, isInstalled, isInstalling } = useInstallPrompt();

  if (!(canInstall || isInstalled)) {
    return null;
  }

  return (
    <>
      <Separator />

      <section className="grid min-w-0 gap-2" data-slot="settings-install">
        <Button
          aria-disabled={isInstalled || undefined}
          className="w-full"
          disabled={isInstalled}
          isLoading={isInstalling}
          onClick={install}
          size="lg"
          variant="brown"
        >
          <Download />
          {isInstalled
            ? m["ui.install.installed"]()
            : m["ui.install.install"]()}
        </Button>
      </section>
    </>
  );
};
