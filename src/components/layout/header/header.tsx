import type React from "react";
import { cn } from "@/lib/cn";
import { HeaderActions } from "./header.actions";
import { HeaderGold } from "./header.gold";
import { HeaderNavigation } from "./header.navigation";

export const Header = (props: React.ComponentProps<"header">) => {
  const { className, ...rest } = props;

  return (
    <header
      className={cn(
        "z-50 flex shrink-0 items-center justify-between gap-1 border-primary border-b bg-secondary/90 backdrop-blur-md",
        "px-2 pt-[calc(env(safe-area-inset-top,0)+var(--spacing)*3)] pb-2",
        "sm:px-3 sm:pb-3",
        "sticky top-0",
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
