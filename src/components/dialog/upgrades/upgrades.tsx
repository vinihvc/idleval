import { ArrowUpBox } from "pixelarticons/react";
import { DialogNavTrigger } from "@/components/dialog/dialog-nav-trigger";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { FACTORIES, type FactoryType } from "@/content/factories";
import { UpgradesCard } from "./upgrades.card";

interface UpgradesDialogProps {
  variant?: "bottom" | "header";
}

export const UpgradesDialog = (props: UpgradesDialogProps) => {
  const { variant = "header" } = props;

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={ArrowUpBox}
        label="Upgrades"
        value="upgrades"
        variant={variant}
      />

      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt="Upgrades"
          src="/images/upgrades/upgrade.webp"
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Upgrades</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Improve workshops and halls to double the crown&apos;s takings.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(FACTORIES).map(([key]) => (
              <UpgradesCard factoryType={key as FactoryType} key={key} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
