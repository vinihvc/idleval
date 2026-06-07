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
import { ManagersCard } from "./managers.card";

export const ManagersDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt="Manager"
            src="/images/managers/manager.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Managers</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Name legendary managers to keep each pillar running while you ride
            afar.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-3 gap-4">
            {FACTORY_TYPES.map((factoryType) => (
              <ManagersCard factoryType={factoryType} key={factoryType} />
            ))}
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
