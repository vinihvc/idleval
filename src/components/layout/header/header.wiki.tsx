import { BookOpen } from "pixelarticons/react/BookOpen";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { m } from "@/i18n/messages";
import { IS_DEV } from "@/lib/envs";

const LazyWikiDialog = React.lazy(
  () => import("@/components/dialog/wiki/wiki")
);

export const HeaderWiki = () => {
  const [open, setOpen] = React.useState(false);

  if (!IS_DEV) {
    return null;
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setOpen(true)} size="icon-md" variant="cream">
            <span className="sr-only">{m["ui.wiki.open"]()}</span>
            <BookOpen />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m["ui.wiki.title"]()}</TooltipContent>
      </Tooltip>

      <React.Suspense fallback={null}>
        <LazyWikiDialog onOpenChange={setOpen} open={open} />
      </React.Suspense>
    </>
  );
};
