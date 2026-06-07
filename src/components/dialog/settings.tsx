import { Menu, Reload } from "pixelarticons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { HoldButton } from "@/components/ui/hold-button";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toggleMusic, toggleSfx, useSettings } from "@/store/atoms/settings";
import { resetGame } from "@/store/reset";

export const SettingsDialog = () => {
  const settings = useSettings();

  const [open, setOpen] = React.useState(false);

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button size="icon-md" variant="cream">
              <span className="sr-only">Open Settings</span>
              <Menu />
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Settings</TooltipContent>
      </Tooltip>

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt="Settings"
            src="/images/msc/setting.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Settings</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            Tune courtly comforts to your liking.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-4">
            <FieldGroup>
              <Field
                className="rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-3 text-popover-foreground"
                orientation="horizontal"
                reverse
              >
                <Switch
                  checked={settings.music}
                  onCheckedChange={toggleMusic}
                />
                <FieldLabel className="font-semibold">Music</FieldLabel>
              </Field>

              <Field
                className="rounded-md border border-primary/25 bg-popover-foreground/6 px-3 py-3 text-popover-foreground"
                orientation="horizontal"
                reverse
              >
                <Switch checked={settings.sfx} onCheckedChange={toggleSfx} />
                <FieldLabel className="font-semibold">SFX</FieldLabel>
              </Field>
            </FieldGroup>

            <HoldButton
              aria-label="Hold  to reset the game."
              className="w-full"
              holdLabel="Hold..."
              onHoldComplete={() => {
                resetGame();
                setOpen(false);
              }}
              size="lg"
              variant="destructive"
            >
              <Reload />
              Reset game
            </HoldButton>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
