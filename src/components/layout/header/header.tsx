import type React from "react";
import { HeaderNavigation } from "@/components/layout/navigation";
import { cn } from "@/lib/cn";
import { HeaderActions } from "./header.actions";
import { HeaderGold } from "./header.gold";

interface HeaderProps extends React.ComponentProps<"header"> {}

export const Header = (props: HeaderProps) => {
  const { className, ...rest } = props;

  return (
    <header
      className={cn(
        "z-50 flex shrink-0 items-center justify-between gap-1 border-primary border-b-2 bg-secondary/90 backdrop-blur-md",
        "px-3 pt-[calc(env(safe-area-inset-top,0)+var(--spacing)*3)] pb-3",
        "max-sm:gap-1 max-sm:px-2 max-sm:pb-2",
        "sticky top-0 shrink-0",
        className
      )}
      {...rest}
    >
      <HeaderGold />

      <HeaderNavigation />

      <HeaderActions />
    </header>
  );
};
