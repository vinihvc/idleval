import { Image } from "@unpic/react";
import { POWER_UP_DATA, type PowerUpId } from "@/content/power-ups";
import { cn } from "@/lib/cn";

interface PowerUpIconProps {
  className?: string;
  powerUpId: PowerUpId;
}

export const PowerUpIcon = (props: PowerUpIconProps) => {
  const { powerUpId, className } = props;

  return (
    <Image
      alt=""
      aria-hidden
      className={cn("size-4 object-contain", className)}
      data-slot="power-up-icon"
      height={400}
      src={POWER_UP_DATA[powerUpId].image}
      width={400}
    />
  );
};
