import { UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { FACTORIES, type FactoryType } from "@/content/factories";
import { DialogNavTrigger } from "../dialog-nav-trigger";
import { ManagersCard } from "./managers.card";

interface ManagersDialogProps {
  variant?: "bottom" | "header";
}

export const ManagersDialog = (props: ManagersDialogProps) => {
  const { variant = "header" } = props;

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={UserSearch}
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
            Hire managers to automate your factories.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(FACTORIES).map(([key]) => (
              <ManagersCard factoryType={key as FactoryType} key={key} />
            ))}
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="xl">Close Managers</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
