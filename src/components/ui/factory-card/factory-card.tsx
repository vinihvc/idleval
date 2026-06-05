import { Progress } from "@/components/ui/progress/progress";
import type { FactoryType } from "@/content/factories";
import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/cn";
import { useFactory } from "@/store/atoms/factories";
import { FactoryCardProduce } from "./factory-card.produce";
import { FactoryCardUpgrade } from "./factory-card.upgrade";

interface FactoryCardProps extends React.ComponentProps<"article"> {
  /**
   * The type of factory
   */
  type: FactoryType;
}

export const FactoryCard = (props: FactoryCardProps) => {
  const { type, className, ...rest } = props;

  const { isUnlocked, isAutomated } = useFactory(type);

  const { seconds, isRunning, cycleKey } = useCountdown(type);

  return (
    <article
      aria-disabled={!isUnlocked}
      className={cn(
        "relative inset-shadow-xs flex min-w-0 items-center pl-10",
        className
      )}
      {...rest}
    >
      <FactoryCardProduce
        className="absolute top-1/2 left-0 z-10 -translate-y-1/2"
        factoryType={type}
      />

      <div
        className={cn(
          "inset-shadow-xs grid h-22 w-full min-w-0 gap-1 overflow-hidden rounded-r-xl border-3 py-2 pr-3 pl-16",
          "border-primary/40 bg-popover/90 text-popover-foreground",
          isUnlocked &&
            "border-primary/60 shadow-[inset_0_0_12px_oklch(0.78_0.12_85/0.08)]"
        )}
      >
        <Progress
          cycleKey={cycleKey}
          factoryType={type}
          isAutomated={isAutomated}
          isUnlocked={isUnlocked && isRunning}
          value={seconds}
        />

        <FactoryCardUpgrade factoryType={type} />
      </div>
    </article>
  );
};
