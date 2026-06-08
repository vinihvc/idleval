import type React from "react";
import { HeaderNavigation } from "@/components/layout/navigation";
import { cn } from "@/lib/cn";
import { HeaderActions } from "./header.actions";
import { HeaderGold } from "./header.gold";

export const Header = (props: React.ComponentProps<"header">) => {
  const { className, ...rest } = props;

  return (
    <header
      className={cn(
        "z-50 flex shrink-0 items-center justify-between gap-1 border-primary border-b-2 bg-secondary/90 backdrop-blur-md",
        "px-2 pt-[calc(env(safe-area-inset-top,0)+var(--spacing)*3)] pb-2",
        "sm:px-3 sm:pb-3",
        "sticky top-0 shrink-0",
        className
      )}
      data-slot="header"
      {...rest}
    >
      <HeaderGold />

      <HeaderNavigation />

      <HeaderActions />
    </header>
  );
};
