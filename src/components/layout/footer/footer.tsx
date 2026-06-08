import type React from "react";
import { Suspense } from "react";
import { LazyAboutDialog } from "@/components/dialog/lazy";
import { ResponsiveDialogTrigger } from "@/components/ui/responsive-dialog";
import { m } from "@/i18n/messages";
import { cn } from "@/lib/cn";

interface FooterProps extends React.ComponentProps<"footer"> {}

export const Footer = (props: FooterProps) => {
  const { className, ...rest } = props;

  return (
    <footer
      className={cn(
        "shrink-0 px-4 py-3 text-foreground/80 max-md:hidden",
        "md:absolute md:inset-x-0 md:bottom-0",
        className
      )}
      {...rest}
    >
      <div className="flex justify-center gap-5 font-medium text-sm md:justify-end">
        <div>
          <Suspense fallback={null}>
            <LazyAboutDialog>
              <ResponsiveDialogTrigger className="text-primary underline-offset-4 outline-hidden transition-colors hover:underline focus-visible:underline">
                {m["ui.nav.about"]()}
              </ResponsiveDialogTrigger>
            </LazyAboutDialog>
          </Suspense>
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
