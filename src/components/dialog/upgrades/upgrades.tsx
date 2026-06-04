import { ArrowBigUpDash } from "lucide-react";
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
import { UpgradesCard } from "./upgrades.card";

interface UpgradesDialogProps {
  variant?: "bottom" | "header";
}

export const UpgradesDialog = (props: UpgradesDialogProps) => {
  const { variant = "header" } = props;

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={ArrowBigUpDash}
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
            Upgrade your factories to increase your income.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(FACTORIES).map(([key]) => (
              <UpgradesCard factoryType={key as FactoryType} key={key} />
            ))}
          </div>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button size="lg">Close Upgrades</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
