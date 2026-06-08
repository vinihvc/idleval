import {
  AudioWaveform,
  Music,
  Volume1,
  Volume2,
  Volume3,
} from "pixelarticons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { m } from "@/i18n/messages";

const SLIDER_STEP = 0.05;

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
  value: number;
}

const VolumeControl = (props: VolumeControlProps) => {
  const { icon, label, muteAriaLabel, onChange, value } = props;

  const labelId = React.useId();
  const lastVolumeRef = React.useRef(value > 0 ? value : 0.8);

  React.useEffect(() => {
    if (value > 0) {
      lastVolumeRef.current = value;
    }
  }, [value]);

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
    <div className="grid w-full min-w-0 grid-cols-1 items-center gap-3 md:grid-cols-2">
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-md border-2 bg-secondary/15 text-popover-foreground [&_svg:not([class*='size-'])]:size-5"
        >
          {icon}
        </span>

        <span
          className="truncate font-semibold text-base text-popover-foreground"
          id={labelId}
        >
          {label}
        </span>
      </div>

      <div className="flex w-full min-w-0 items-center gap-2 md:px-2.5">
        <Button
          aria-label={muteAriaLabel}
          aria-pressed={isMuted}
          className="shrink-0 max-md:hidden"
          onClick={toggleMute}
          size="icon-sm"
          sound={false}
          variant={isMuted ? "stone" : "brown"}
        >
          <VolumeIcon aria-hidden />
        </Button>

        <Slider
          className="w-full min-w-0 md:flex-1"
          max={1}
          min={0}
          onValueChange={(details) => {
            onChange(clampVolume(details.value[0] ?? 0));
          }}
          step={SLIDER_STEP}
          value={[value]}
        />
      </div>
    </div>
  );
};

interface SettingsAudioProps {
  musicVolume: number;
  onMusicVolumeChange: (value: number) => void;
  onSfxVolumeChange: (value: number) => void;
  sfxVolume: number;
}

export const SettingsAudio = (props: SettingsAudioProps) => {
  const { musicVolume, onMusicVolumeChange, onSfxVolumeChange, sfxVolume } =
    props;

  return (
    <FieldSet className="gap-4">
      <FieldLegend className="sr-only" variant="legend">
        {m["ui.settings.audio"]()}
      </FieldLegend>

      <FieldGroup className="min-w-0">
        <VolumeControl
          icon={<Music />}
          label={m["ui.settings.music"]()}
          muteAriaLabel={m["ui.settings.muteMusic"]()}
          onChange={onMusicVolumeChange}
          value={musicVolume}
        />

        <VolumeControl
          icon={<AudioWaveform />}
          label={m["ui.settings.sfx"]()}
          muteAriaLabel={m["ui.settings.muteSfx"]()}
          onChange={onSfxVolumeChange}
          value={sfxVolume}
        />
      </FieldGroup>
    </FieldSet>
  );
};
