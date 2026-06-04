import { cn } from "@/lib/cn";

interface FantasyCornerProps {
  className?: string;
  position: "tl" | "tr" | "bl" | "br";
}

export const FantasyCorner = (props: FantasyCornerProps) => {
  const { position, className } = props;

  const positionClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0 rotate-90",
    bl: "bottom-0 left-0 -rotate-90",
    br: "bottom-0 right-0 rotate-180",
  }[position];

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute size-3 text-primary sm:size-4",
        positionClass,
        className
      )}
      fill="currentColor"
      role="presentation"
      viewBox="0 0 8 8"
    >
      <rect height="2" width="2" x="0" y="0" />
      <rect height="2" width="4" x="0" y="2" />
      <rect height="2" width="2" x="2" y="4" />
      <rect height="2" width="2" x="4" y="4" />
    </svg>
  );
};
