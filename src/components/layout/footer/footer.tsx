import React from "react";

const LazyAboutDialog = React.lazy(
  () => import("@/components/dialog/about/about")
);

import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";

export const Footer = (props: React.ComponentProps<"footer">) => {
  const { className, ...rest } = props;

  return (
    <footer
      className={cn(
        "hidden shrink-0 px-4 py-3 text-foreground/80 md:block",
        "md:absolute md:inset-x-0 md:bottom-0",
        className
      )}
      {...rest}
    >
      <div className="flex justify-center gap-5 font-medium text-sm md:justify-end">
        <div>
          <React.Suspense fallback={null}>
            <LazyAboutDialog>
              <ResponsiveDialogTrigger className="text-primary underline-offset-4 outline-hidden transition-colors hover:underline focus-visible:underline">
                {m["ui.nav.about"]()}
              </ResponsiveDialogTrigger>
            </LazyAboutDialog>
          </React.Suspense>
        </div>

        <a
          className="transition-colors hover:text-primary"
          href="https://vini.one"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          &copy; Vinicius Vicentini
        </a>
      </div>
    </footer>
  );
};
