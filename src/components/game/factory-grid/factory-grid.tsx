import type React from "react";
import { FactoryCard } from "@/components/ui/factory-card";
import { FACTORY_TYPES } from "@/content/factories";
import { m } from "@/i18n/messages";

export const FactoryGrid = (props: React.ComponentProps<"section">) => {
  const { className, ...rest } = props;

  return (
    <section
      aria-label={m["ui.factoryGrid.label"]()}
      className={className}
      {...rest}
    >
      <div className="grid w-full gap-10 px-3 py-6 md:grid-cols-2 md:gap-8">
        {FACTORY_TYPES.map((factory) => (
          <FactoryCard key={factory} type={factory} />
        ))}
      </div>
    </section>
  );
};
