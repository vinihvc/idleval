import { WIKI_TIP_IDS } from "@/content/wiki-tips";
import { translate } from "@/i18n/localize";
import { cn } from "@/lib/cn";

export const WikiTipsTab = () => (
  <div className="grid gap-3">
    {WIKI_TIP_IDS.map((tipId) => (
      <article
        className={cn(
          "grid gap-2 rounded-md border-3 border-secondary/50 bg-secondary/10 p-3",
          "text-popover-foreground",
          "shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]"
        )}
        data-slot="wiki-tip"
        key={tipId}
      >
        <h3 className="font-bold text-sm tracking-wide">
          {translate(`wiki.tip.${tipId}.title`)}
        </h3>
        <p className="text-sm leading-relaxed">
          {translate(`wiki.tip.${tipId}.body`)}
        </p>
      </article>
    ))}
  </div>
);
