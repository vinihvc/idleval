import { Brackets } from "pixelarticons/react/Brackets";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FACTORY_TYPES, type FactoryType } from "@/content/factories";
import { IS_DEV } from "@/lib/envs";
import { useFactories } from "@/store/atoms/factories";

export const FactoryState = () => {
  const factories = useFactories();

  const [activeFactory, setActiveFactory] = React.useState<FactoryType>(
    FACTORY_TYPES[0]
  );

  if (!IS_DEV) {
    return null;
  }

  return (
    <Popover modal={false} positioning={{ placement: "top", gutter: 24 }}>
      <PopoverTrigger asChild>
        <Button size="icon-lg" variant="wine">
          <span className="sr-only">Factories JSON</span>
          <Brackets />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-w-lg">
        <PopoverHeader className="sr-only" title="Factories state" />

        <PopoverBody className="max-h-[60vh]">
          <Tabs
            onValueChange={(details) => {
              setActiveFactory(details.value as FactoryType);
            }}
            value={activeFactory}
          >
            <TabsList>
              {FACTORY_TYPES.map((factory) => (
                <TabsTrigger
                  className="capitalize"
                  key={factory}
                  value={factory}
                >
                  {factory}
                </TabsTrigger>
              ))}
            </TabsList>

            {FACTORY_TYPES.map((factory) => (
              <TabsContent
                className="mt-2 min-h-0"
                key={factory}
                value={factory}
              >
                <pre className="whitespace-pre-wrap break-all rounded-md border bg-muted/30 p-3 font-number text-sm sm:text-base">
                  {JSON.stringify(factories[factory], null, 2)}
                </pre>
              </TabsContent>
            ))}
          </Tabs>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FactoryState;
