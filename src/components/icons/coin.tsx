import { Image } from "@unpic/react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const COIN_IMAGE_SRC = "/images/icons/coin.webp" as const;

const DEFAULT_INTRINSIC_SIZE = 40;

export interface CoinProps extends HTMLAttributes<HTMLImageElement> {
  intrinsicSize?: number;
}

export const Coin = ({
  className,
  intrinsicSize = DEFAULT_INTRINSIC_SIZE,
  "aria-hidden": ariaHidden = true,
  ...props
}: CoinProps) => (
  <Image
    alt=""
    aria-hidden={ariaHidden}
    className={cn("pixel-crisp shrink-0 object-contain", className)}
    height={intrinsicSize}
    layout="constrained"
    src={COIN_IMAGE_SRC}
    width={intrinsicSize}
    {...props}
  />
);
