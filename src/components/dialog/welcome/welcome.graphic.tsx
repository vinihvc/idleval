import { Image } from "@unpic/react";
import { cn } from "@/lib/cn";

export const WelcomeGraphic = () => (
  <Image
    aria-hidden
    className={cn(
      "absolute -top-12 left-1/2 inline-flex -translate-x-1/2 sm:-top-18 md:left-2 md:translate-x-0",
      "pixel-crisp object-cover",
      "aspect-square size-22 sm:size-28",
      "drop-shadow-lg",
      "pointer-events-none"
    )}
    height={112}
    layout="constrained"
    src="/images/msc/welcome.webp"
    width={112}
  />
);
