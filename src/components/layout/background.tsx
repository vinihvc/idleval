import { Image } from "@unpic/react";

export const Background = () => (
  <>
    <Image
      aria-hidden
      className="pointer-events-none absolute inset-0 h-[200dvh] w-screen scale-110 object-cover blur-sm [image-rendering:pixelated]"
      height={1080}
      src="/images/bg.webp"
      width={1920}
    />
    <div className="fixed inset-0 bg-foreground/20" />
  </>
);
