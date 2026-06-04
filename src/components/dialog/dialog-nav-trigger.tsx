import type { ComponentType, SVGProps } from "react";

type PixelartIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;

import {
  BottomNavigationItem,
  BottomNavigationItemIcon,
} from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DialogNavTriggerProps {
  icon: PixelartIcon;
  label: string;
  value?: string;
  variant: "bottom" | "header";
}

export const DialogNavTrigger = (props: DialogNavTriggerProps) => {
  const { icon: Icon, label, variant, value } = props;

  if (variant === "bottom") {
    return (
      <BottomNavigationItem asChild value={value ?? label}>
        <ResponsiveDialogTrigger asChild>
          <button
            className="flex size-full flex-col items-center justify-center"
            type="button"
          >
            <BottomNavigationItemIcon>
              <Icon />
            </BottomNavigationItemIcon>
            <span className="sr-only">{label}</span>
          </button>
        </ResponsiveDialogTrigger>
      </BottomNavigationItem>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ResponsiveDialogTrigger asChild>
          <Button size="icon-md" variant="white">
            <span className="sr-only">{label}</span>
            <Icon />
          </Button>
        </ResponsiveDialogTrigger>
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
