import type React from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

const linkClass =
  "font-semibold text-popover-foreground underline decoration-primary/60 underline-offset-4 transition-colors hover:decoration-primary";

export const AboutDialog = (props: React.PropsWithChildren) => {
  const { children } = props;

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogImage alt="About" src="/images/msc/about.webp" />

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>About the Realm</ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            A realm does not fall for lack of gold; it falls for lack of
            granary, lance, and law. Raise your settlement from a single field
            of grain, gather tribute, and strengthen every guild and workshop,
            even while you ride afar.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-3">
            <p className="font-display font-semibold text-lg text-popover-foreground tracking-wide">
              Royal Codex
            </p>

            <ul className="list-disc space-y-1 pl-4 text-popover-foreground/90 leading-relaxed">
              <li>
                Made with{" "}
                <a
                  className={linkClass}
                  href="https://react.dev/"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  React
                </a>
              </li>
              <li>
                Styling with{" "}
                <a
                  className={linkClass}
                  href="https://tailwindcss.com/"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  Tailwind
                </a>
              </li>
              <li>
                Components with{" "}
                <a
                  className={linkClass}
                  href="https://shark.vini.one/"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  Shark UI
                </a>
              </li>
              <li>
                Icons by{" "}
                <a
                  className={linkClass}
                  href="https://pixelarticons.com/"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  Pixelarticons
                </a>
              </li>
              <li>
                State management with{" "}
                <a
                  className={linkClass}
                  href="https://jotai.org/"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  Jotai
                </a>
              </li>
              <li>
                Images by{" "}
                <a
                  className={linkClass}
                  href="https://chatgpt.com"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  ChatGPT
                </a>
              </li>
            </ul>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
