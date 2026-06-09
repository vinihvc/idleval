import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { IS_DEV } from "@/lib/envs";
import { useVariantTools, VARIANT_TOOLS } from "@/providers/variant-tools";

export const VariantTools = () => {
  const { setVariant, variant } = useVariantTools();

  if (!IS_DEV) {
    return null;
  }

  return (
    <div
      className="fixed top-[calc(env(safe-area-inset-top,0)+var(--spacing)*3)] right-2 z-50"
      data-slot="variant-tools"
    >
      <fieldset className="flex items-center gap-1">
        {VARIANT_TOOLS.map((v) => (
          <Button
            aria-keyshortcuts={v}
            aria-label={`Variant ${v}`}
            className={cn("font-number uppercase", {
              "ring-2 ring-primary/50": variant === v,
            })}
            key={v}
            onClick={() => setVariant(v)}
            size="icon-md"
            variant={variant === v ? "default" : "stone"}
          >
            {v}
          </Button>
        ))}
      </fieldset>
    </div>
  );
};
