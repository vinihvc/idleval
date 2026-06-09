import { Image } from "@unpic/react";
import type React from "react";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";

export interface WikiEntryProps extends React.ComponentProps<"article"> {
  flavor: string;
  icon?: string;
  image: string;
  lore: string;
  mechanics: string;
  title: string;
}

export const WikiEntry = (props: WikiEntryProps) => {
  const { title, flavor, lore, mechanics, image, icon, className, ...rest } =
    props;

  return (
    <article
      className={cn(
        "grid gap-3 rounded-md border-3 border-secondary/50 bg-secondary/10 p-3",
        "text-popover-foreground",
        "shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
        className
      )}
      data-slot="wiki-entry"
      {...rest}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "relative size-16 shrink-0 overflow-hidden rounded-sm",
            "border-2 border-primary-foreground/25 bg-muted",
            "shadow-[inset_0_2px_8px_oklch(0.12_0.02_55/0.35)]"
          )}
        >
          <Image
            alt=""
            aria-hidden
            className="pixel-crisp size-full object-contain object-center"
            height={64}
            layout="constrained"
            src={image}
            width={64}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-sm leading-tight tracking-wide">
              {title}
            </h3>
            {icon && (
              <Image
                alt=""
                aria-hidden
                className="pixel-crisp size-4 shrink-0 rounded-sm object-contain"
                height={16}
                layout="constrained"
                src={icon}
                width={16}
              />
            )}
          </div>
          <p className="mt-1 text-primary-foreground text-sm italic leading-relaxed">
            {flavor}
          </p>
        </div>
      </div>

      <div className="grid gap-2 text-sm leading-relaxed">
        <div>
          <p className="font-display font-semibold text-primary-foreground text-xs uppercase tracking-wider">
            {m["ui.wiki.section.lore"]()}
          </p>
          <p className="mt-1">{lore}</p>
        </div>

        <div>
          <p className="font-display font-semibold text-primary-foreground text-xs uppercase tracking-wider">
            {m["ui.wiki.section.mechanics"]()}
          </p>
          <p className="mt-1">{mechanics}</p>
        </div>
      </div>
    </article>
  );
};
