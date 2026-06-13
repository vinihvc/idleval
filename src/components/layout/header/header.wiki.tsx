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
import { DIALOG_IDS, toggleDialog } from "@/store/atoms/dialogs";

const LazyWikiDialog = React.lazy(
  () => import("@/components/dialog/wiki/wiki")
);

export const HeaderWiki = () => (
  <>
    {IS_DEV && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => toggleDialog(DIALOG_IDS.wiki)}
            size="icon-sm"
            variant="cream"
          >
            <span className="sr-only">{m["ui.wiki.open"]()}</span>
            <BookOpen />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{m["ui.wiki.title"]()}</TooltipContent>
      </Tooltip>
    )}

    <React.Suspense fallback={null}>
      <LazyWikiDialog />
    </React.Suspense>
  </>
);
