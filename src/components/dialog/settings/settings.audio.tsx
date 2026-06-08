import { AudioWaveform } from "pixelarticons/react/AudioWaveform";
import { Music } from "pixelarticons/react/Music";
import { Volume1 } from "pixelarticons/react/Volume1";
import { Volume2 } from "pixelarticons/react/Volume2";
import { Volume3 } from "pixelarticons/react/Volume3";
import React from "react";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { m } from "@/i18n/messages";

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
  const isDraggingRef = React.useRef(false);
  const lastVolumeRef = React.useRef(value > 0 ? value : 0.8);
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (localValue > 0) {
      lastVolumeRef.current = localValue;
    }
  }, [localValue]);

  const commitValue = (next: number) => {
    const clamped = clampVolume(next);
    setLocalValue(clamped);
    onChange(clamped);
  };

  const toggleMute = () => {
    if (localValue === 0) {
      commitValue(lastVolumeRef.current);
      return;
    }

    lastVolumeRef.current = localValue;
    commitValue(0);
  };

  const VolumeIcon = getVolumeIcon(localValue);
  const isMuted = localValue === 0;

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
          className="hidden shrink-0 md:inline-flex"
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
            isDraggingRef.current = true;
            setLocalValue(clampVolume(details.value[0] ?? 0));
          }}
          onValueChangeEnd={(details) => {
            isDraggingRef.current = false;
            commitValue(details.value[0] ?? 0);
          }}
          step={0.05}
          value={[localValue]}
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
