import {
  Progress,
  ProgressRange,
  ProgressTrack,
} from "@/components/ui/progress";
import { borderedText } from "@/components/ui/text-border";
import { cn } from "@/lib/cn";

interface MissionProressbarProps {
  label: string;
  value: number;
}

export const MissionProressbar = (props: MissionProressbarProps) => {
  const { label, value } = props;

  return (
    <Progress
      aria-valuetext={label}
      className={cn(
        "h-4 w-full max-w-1/3",
        "inset-shadow-xs rounded-sm border-2 border-primary/40 bg-muted",
        "overflow-hidden"
      )}
      value={value}
    >
      <ProgressTrack className="absolute inset-0 min-h-0 overflow-hidden bg-transparent">
        <ProgressRange className="h-full bg-primary" />
      </ProgressTrack>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          "flex items-center justify-center px-1",
          "text-nowrap font-medium text-foreground text-sm tracking-wide",
          borderedText({ variant: "cream", size: "sm" })
        )}
      >
        <span className="font-number tabular-nums">{label}</span>
      </div>
    </Progress>
  );
};
