import { Trans, useLingui } from "@lingui/react/macro";
import {
  AudioWaveform,
  Menu,
  Music,
  Reload,
  Volume1,
  Volume2,
  Volume3,
} from "pixelarticons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
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
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type AppLocale,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
} from "@/i18n/locale";
import { useLocale } from "@/providers/i18n";
import { useSound } from "@/providers/sound";
import { resetGame } from "@/store/reset";

const SLIDER_STEP = 0.05;
const PREVIEW_DEBOUNCE_MS = 150;

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const getVolumeIcon = (value: number) => {
  if (value === 0) {
    return Volume1;
  }

  if (value <= 0.5) {
    return Volume2;
  }

  return Volume3;
};

interface VolumeControlProps {
  icon: React.ReactNode;
  label: string;
  muteAriaLabel: string;
  onChange: (value: number) => void;
  onPreview?: () => void;
  value: number;
}

const VolumeControl = (props: VolumeControlProps) => {
  const { icon, label, muteAriaLabel, onChange, onPreview, value } = props;

  const labelId = React.useId();
  const lastVolumeRef = React.useRef(value > 0 ? value : 0.8);
  const previewTimeoutRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  React.useEffect(() => {
    if (value > 0) {
      lastVolumeRef.current = value;
    }
  }, [value]);

  React.useEffect(
    () => () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    },
    []
  );

  const schedulePreview = (volume: number) => {
    if (!onPreview || volume <= 0) {
      return;
    }

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    previewTimeoutRef.current = setTimeout(() => {
      onPreview();
    }, PREVIEW_DEBOUNCE_MS);
  };

  const handleChange = (next: number, preview = false) => {
    const clamped = clampVolume(next);
    onChange(clamped);

    if (preview && onPreview && clamped > 0) {
      schedulePreview(clamped);
    }
  };

  const toggleMute = () => {
    if (value === 0) {
      onChange(lastVolumeRef.current);
      return;
    }

    lastVolumeRef.current = value;
    onChange(0);
  };

  const VolumeIcon = getVolumeIcon(value);
  const isMuted = value === 0;

  return (
    <>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/15 text-popover-foreground [&_svg:not([class*='size-'])]:size-5"
        >
          {icon}
        </span>

        <span className="font-semibold text-base" id={labelId}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          aria-label={muteAriaLabel}
          aria-pressed={isMuted}
          className="shrink-0"
          onClick={toggleMute}
          size="icon-xl"
          sound={false}
          variant={isMuted ? "stone" : "brown"}
        >
          <VolumeIcon aria-hidden />
        </Button>

        <Slider
          max={1}
          min={0}
          onValueChange={(details) => {
            handleChange(details.value[0] ?? 0, true);
          }}
          step={SLIDER_STEP}
          value={[value]}
        />
      </div>
    </>
  );
};

export const SettingsDialog = () => {
  const { t } = useLingui();
  const { locale, setLocale } = useLocale();
  const { musicVolume, play, setMusicVolume, setSfxVolume, sfxVolume } =
    useSound();

  const [open, setOpen] = React.useState(false);

  return (
    <ResponsiveDialog onOpenChange={setOpen} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button size="icon-md" variant="cream">
              <span className="sr-only">
                <Trans>Open Settings</Trans>
              </span>
              <Menu />
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>

        <TooltipContent>
          <Trans>Settings</Trans>
        </TooltipContent>
      </Tooltip>

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage
            alt={t`Settings`}
            src="/images/msc/setting.webp"
          />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            <Trans>Settings</Trans>
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            <Trans>Tune courtly comforts to your liking.</Trans>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="grid gap-4">
          <FieldSet className="gap-4">
            <FieldLegend className="sr-only" variant="legend">
              <Trans>Language</Trans>
            </FieldLegend>

            <div className="grid gap-2">
              <span className="font-semibold text-base">
                <Trans>Language</Trans>
              </span>

              <div className="grid gap-2">
                {SUPPORTED_LOCALES.map((option) => (
                  <Button
                    aria-pressed={locale === option}
                    key={option}
                    onClick={() => setLocale(option as AppLocale)}
                    size="md"
                    variant={locale === option ? "default" : "stone"}
                  >
                    {LOCALE_LABELS[option]}
                  </Button>
                ))}
              </div>
            </div>
          </FieldSet>

          <FieldSet className="gap-4">
            <FieldLegend className="sr-only" variant="legend">
              <Trans>Audio</Trans>
            </FieldLegend>

            <FieldGroup>
              <VolumeControl
                icon={<Music />}
                label={t`Music`}
                muteAriaLabel={t`Mute music`}
                onChange={setMusicVolume}
                value={musicVolume}
              />

              <VolumeControl
                icon={<AudioWaveform />}
                label={t`SFX`}
                muteAriaLabel={t`Mute sound effects`}
                onChange={setSfxVolume}
                onPreview={() => {
                  play("coin");
                }}
                value={sfxVolume}
              />
            </FieldGroup>
          </FieldSet>

          <HoldButton
            aria-label={t`Hold to reset the game.`}
            className="w-full text-lg"
            holdLabel={t`Hold...`}
            onHoldComplete={() => {
              resetGame();
              setOpen(false);
            }}
            size="xl"
            variant="destructive"
          >
            <Reload />
            <Trans>Reset game</Trans>
          </HoldButton>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
