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
import { FACTORY_TYPES } from "@/content/factories";
import { m } from "@/i18n/messages";
import { UpgradesCard } from "./upgrades.card";

export const UpgradesDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={m["ui.upgrades.title"]()}
            src="/images/upgrades/upgrade.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {m["ui.upgrades.title"]()}
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription hideDescription>
            {m["ui.upgrades.description"]()}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {FACTORY_TYPES.map((factoryType) => (
              <UpgradesCard factoryType={factoryType} key={factoryType} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
