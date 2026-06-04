import { AvatarCircleX, Crown } from "pixelarticons/react";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { DialogNavTrigger } from "./dialog-nav-trigger";

interface AllianceDialogProps {
  variant?: "bottom" | "header";
}

export const AllianceDialog = (props: AllianceDialogProps) => {
  const { variant = "header" } = props;

  return (
    <ResponsiveDialog>
      <DialogNavTrigger
        icon={Crown}
        label="Alliances"
        value="alliances"
        variant={variant}
      />

      <ResponsiveDialogContent>
        <ResponsiveDialogImage
          alt="Alliances"
          src="/images/alliances/alliance.webp"
        />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Alliances</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Swear pacts with fellow kingdoms to share strength and fortune.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="flex flex-col items-center justify-center gap-3 py-6 font-medium opacity-64">
            <AvatarCircleX aria-hidden className="size-8" />
            <p className="text-center text-popover-foreground/90 leading-relaxed">
              No alliances ply the diplomatic road at this hour.
            </p>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
