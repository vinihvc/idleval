import { Image } from "@unpic/react";
import type React from "react";
import { boxBorder } from "@/components/ui/box-border";
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
  const { title, flavor, lore, mechanics, icon, className, ...rest } = props;

  return (
    <article
      className={cn(
        "grid gap-3 rounded-md border-3 border-secondary/50 bg-secondary/10 p-3",
        "text-popover-foreground",
        boxBorder({ inset: "highlight", soft: "none" }),
        className
      )}
      data-slot="wiki-entry"
      {...rest}
    >
      <header className="border-primary/20 border-b pb-2">
        <div className="flex items-center justify-center gap-1.5">
          {icon && (
            <Image
              alt=""
              aria-hidden
              className="pixel-crisp size-6 shrink-0 rounded-sm object-contain"
              height={24}
              layout="constrained"
              src={icon}
              width={24}
            />
          )}
          <h3 className="font-bold text-base leading-tight tracking-wide">
            {title}
          </h3>
        </div>
        <p className="mt-1 text-center text-primary-foreground italic leading-snug">
          &ldquo;{flavor}&rdquo;
        </p>
      </header>

      <div className="text-justify leading-relaxed [&>*+*]:mt-2">
        <p className="font-display font-semibold text-primary-foreground text-xs uppercase tracking-wider">
          {m["ui.wiki.section.lore"]()}
        </p>
        <p>{lore}</p>

        <p>{mechanics}</p>
      </div>
    </article>
  );
};
