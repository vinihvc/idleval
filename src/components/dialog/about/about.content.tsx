import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { m } from "@/i18n/messages";

export const AboutContent = () => (
  <div className="grid gap-3">
    <p className="font-display font-semibold text-lg text-muted tracking-wide">
      {m["ui.about.codex"]()}
    </p>

    <ul className="list-disc space-y-1 pl-4 text-muted leading-relaxed">
      <AboutLinkItem href="https://react.dev/" message={m["ui.about.react"]} />
      <AboutLinkItem
        href="https://tailwindcss.com/"
        message={m["ui.about.tailwind"]}
      />
      <AboutLinkItem
        href="https://shark.vini.one/"
        message={m["ui.about.sharkUi"]}
      />
      <AboutLinkItem
        href="https://pixelarticons.com/"
        message={m["ui.about.pixelarticons"]}
      />
      <AboutLinkItem href="https://jotai.org/" message={m["ui.about.jotai"]} />
      <AboutLinkItem
        href="https://chatgpt.com"
        message={m["ui.about.chatGpt"]}
      />
    </ul>
  </div>
);

interface AboutLinkItemProps {
  href: string;
  message: (typeof m)["ui.about.react"];
}

const AboutLinkItem = (props: AboutLinkItemProps) => {
  const { href, message } = props;

  return (
    <li>
      <ParaglideMessage
        inputs={{}}
        markup={{
          link: ({ children }) => (
            <a
              className="font-semibold text-muted underline decoration-2 decoration-primary underline-offset-4"
              href={href}
              rel="noopener noreferrer nofollow"
              target="_blank"
            >
              {children}
            </a>
          ),
        }}
        message={message}
      />
    </li>
  );
};
