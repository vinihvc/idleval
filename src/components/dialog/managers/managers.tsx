import { Briefcase } from "pixelarticons/react";
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
import { ManagersCard } from "./managers.card";

interface ManagersDialogProps {
  variant?: "bottom" | "header";
}

export const ManagersDialog = (props: ManagersDialogProps) => {
  const { variant = "header" } = props;

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={Briefcase}
        label="Managers"
        value="managers"
        variant={variant}
      />

      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt="Manager"
          src="/images/managers/manager.webp"
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Managers</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Appoint stewards to keep the works running while you ride afar.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(FACTORIES).map(([key]) => (
              <ManagersCard factoryType={key as FactoryType} key={key} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
