import { Trans, useLingui } from "@lingui/react/macro";
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
import { FACTORY_TYPES } from "@/content/factories.types";
import { UpgradesCard } from "./upgrades.card";

export const UpgradesDialog = (props: React.PropsWithChildren) => {
  const { children } = props;
  const { t } = useLingui();

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={t`Upgrades`}
            src="/images/upgrades/upgrade.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            <Trans>Upgrades</Trans>
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            <Trans>
              Build what makes the realm endure and double the crown&apos;s
              takings from each pillar.
            </Trans>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-3 gap-4">
            {FACTORY_TYPES.map((factoryType) => (
              <UpgradesCard factoryType={factoryType} key={factoryType} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
