import type React from "react";
import { SettingDialog } from "@/components/dialog/settings";
import { Coin } from "@/components/icons/coin";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import { useWallet } from "@/store/atoms/wallet";
import { HeaderNavigation } from "../bottom-navigation";
import { AmountToBuy } from "./header.amount";

interface HeaderProps extends React.ComponentProps<"header"> {}

export const Header = (props: HeaderProps) => {
  const { className, ...rest } = props;

  const { money } = useWallet();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-foreground/50 p-4 backdrop-blur-sm sm:sticky",
        className
      )}
      {...rest}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex h-9 w-36 translate-x-2 items-center justify-end whitespace-nowrap rounded-md border border-foreground bg-background pr-2 shadow-lg">
            <Coin
              aria-hidden
              className="absolute top-0 -left-2 size-12 shrink-0 -translate-y-1.5"
            />

            <span className="font-bold text-base">
              <AnimatedNumber isDollar value={money} />
            </span>
          </div>
        </TooltipTrigger>

        <TooltipContent>Total Gold</TooltipContent>
      </Tooltip>

      <HeaderNavigation />

      <nav className="flex gap-2">
        <AmountToBuy />

        <SettingDialog />
      </nav>
    </header>
  );
};
