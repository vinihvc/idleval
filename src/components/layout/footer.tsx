import type React from "react";
import { AboutDialog } from "@/components/dialog/about";
import { cn } from "@/lib/cn";

interface FooterProps extends React.ComponentProps<"footer"> {}

export const Footer = (props: FooterProps) => {
  const { className, ...rest } = props;

  return (
    <footer
      className={cn(
        "inset-x-0 p-5 text-foreground/80 max-md:hidden md:absolute md:bottom-0",
        className
      )}
      {...rest}
    >
      <div className="flex justify-center gap-5 font-medium text-sm md:justify-end">
        <div>
          <AboutDialog />
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
