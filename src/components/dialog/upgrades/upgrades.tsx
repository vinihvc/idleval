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
import { FACTORY_TYPES } from "@/content/factories";
import { UpgradesCard } from "./upgrades.card";

export const UpgradesDialog = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt="Upgrades"
          src="/images/upgrades/upgrade.webp"
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Upgrades</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Build what makes the realm endure and double the crown&apos;s
            takings from each pillar.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FACTORY_TYPES.map((factoryType) => (
              <UpgradesCard factoryType={factoryType} key={factoryType} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
