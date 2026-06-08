import type React from "react";
import { FactoryCard } from "@/components/ui/factory-card";
import { FACTORY_TYPES } from "@/content/factories";
import { cn } from "@/lib/cn";

export const FactoryGrid = (props: React.ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return (
    <div className={cn("w-full", className)} {...rest}>
      <div className="grid w-full gap-6 px-2 pt-4 pb-10 sm:pb-4 md:grid-cols-2 md:gap-8 md:px-4 md:py-6">
        {FACTORY_TYPES.map((factory) => (
          <FactoryCard key={factory} type={factory} />
        ))}
      </div>
    </div>
  );
};
