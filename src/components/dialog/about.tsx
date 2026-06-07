import { Trans, useLingui } from "@lingui/react/macro";
import type React from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogImage,
  ResponsiveDialogMedia,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";

export const AboutDialog = (props: React.PropsWithChildren) => {
  const { children } = props;
  const { t } = useLingui();

  return (
    <ResponsiveDialog>
      {children}

      <ResponsiveDialogContent>
        <ResponsiveDialogMedia>
          <ResponsiveDialogImage alt={t`About`} src="/images/msc/about.webp" />
        </ResponsiveDialogMedia>

        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            <Trans>About the Realm</Trans>
          </ResponsiveDialogTitle>

          <ResponsiveDialogDescription>
            <Trans>
              A realm does not fall for lack of gold; it falls for lack of
              granary, lance, and law. Raise your settlement from a single field
              of grain, gather tribute, and strengthen every guild and workshop,
              even while you ride afar.
            </Trans>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          <div className="grid gap-3">
            <p className="font-display font-semibold text-lg text-muted tracking-wide">
              <Trans>Royal Codex</Trans>
            </p>

            <ul className="list-disc space-y-1 pl-4 text-muted leading-relaxed">
              <li>
                <Trans>
                  Made with{" "}
                  <a
                    className="font-semibold text-muted underline decoration-2 decoration-primary underline-offset-4"
                    href="https://react.dev/"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    React
                  </a>
                </Trans>
              </li>
              <li>
                <Trans>
                  Styling with{" "}
                  <a
                    className="font-semibold text-muted underline decoration-2 decoration-primary underline-offset-4"
                    href="https://tailwindcss.com/"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Tailwind
                  </a>
                </Trans>
              </li>
              <li>
                <Trans>
                  Components with{" "}
                  <a
                    className="font-semibold text-muted underline decoration-2 decoration-primary underline-offset-4"
                    href="https://shark.vini.one/"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Shark UI
                  </a>
                </Trans>
              </li>
              <li>
                <Trans>
                  Icons by{" "}
                  <a
                    className="font-semibold text-muted underline decoration-2 decoration-primary underline-offset-4"
                    href="https://pixelarticons.com/"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Pixelarticons
                  </a>
                </Trans>
              </li>
              <li>
                <Trans>
                  State management with{" "}
                  <a
                    className="font-semibold text-muted underline decoration-2 decoration-primary underline-offset-4"
                    href="https://jotai.org/"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Jotai
                  </a>
                </Trans>
              </li>
              <li>
                <Trans>
                  Images by{" "}
                  <a
                    className="font-semibold text-muted underline decoration-2 decoration-primary underline-offset-4"
                    href="https://chatgpt.com"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    ChatGPT
                  </a>
                </Trans>
              </li>
            </ul>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
