import { Download } from "pixelarticons/react/Download";
import { Button } from "@/components/ui/button";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { m } from "@/i18n/messages";

const installTitleId = "settings-install-title";
const installDescriptionId = "settings-install-description";

const getInstallDescription = (
  isInstalled: boolean,
  showIosInstructions: boolean
) => {
  if (isInstalled) {
    return m["ui.install.installedDescription"]();
  }

  if (showIosInstructions) {
    return m["ui.install.iosInstructions"]();
  }

  return m["ui.install.description"]();
};

export const SettingsInstall = () => {
  const {
    canInstall,
    install,
    isInstalled,
    isInstalling,
    showIosInstructions,
  } = useInstallPrompt();

  if (!(canInstall || isInstalled || showIosInstructions)) {
    return null;
  }

  const description = getInstallDescription(isInstalled, showIosInstructions);

  return (
    <>
      <Separator />

      <FieldSet className="grid min-w-0 gap-2" data-slot="settings-install">
        <FieldLegend className="sr-only" variant="legend">
          {m["ui.install.label"]()}
        </FieldLegend>

        <h3 className="font-semibold text-sm" id={installTitleId}>
          {m["ui.install.title"]()}
        </h3>

        <p className="text-muted-foreground text-sm" id={installDescriptionId}>
          {description}
        </p>

        {canInstall || isInstalled ? (
          <Button
            aria-describedby={installDescriptionId}
            aria-disabled={isInstalled || undefined}
            aria-label={
              isInstalled
                ? m["ui.install.installed"]()
                : m["ui.install.install"]()
            }
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
        ) : null}
      </FieldSet>
    </>
  );
};
