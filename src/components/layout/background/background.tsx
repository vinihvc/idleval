import { Image } from "@unpic/react";

export const Background = () => (
  <>
    <Image
      aria-hidden
      className="pixel-crisp pointer-events-none absolute inset-0 h-full w-screen object-cover"
      height={1080}
      src="/images/bg.webp"
      width={1920}
    />
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 hidden bg-linear-to-b from-stone-950/30 via-transparent to-stone-950/60 sm:block"
    />
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 hidden bg-radial-[ellipse_at_center] from-transparent via-transparent to-stone-950/50 sm:block"
    />
  </>
);
